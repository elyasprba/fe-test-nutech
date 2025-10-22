import {
  Button,
  Card,
  Col,
  Flex,
  InputNumber,
  Layout,
  Row,
  Spin,
  Tabs,
} from "antd";
import { useState } from "react";
import { CreditCardOutlined } from "@ant-design/icons";
import Navbar from "../../components/navbar";
import { useGetServices } from "../../api/services";
import type { ServiceItem } from "../../components/service-list";
import ConfirmModal from "../../components/modal/confirm-modal";
import {
  useGetTransactionHistory,
  usePostTransaction,
  type TransactionFormValues,
} from "../../api/transaction";
import SuccessModal from "../../components/modal/success-modal";
import ErrorModal from "../../components/modal/error-modal";
import ProfileBalanceCard from "../../components/profile-balance-card";

const { Content, Footer } = Layout;

const contentStyle: React.CSSProperties = {
  color: "#000",
  backgroundColor: "#fff",
  paddingInline: 300,
};

const footerStyle: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#F4271A",
  paddingInline: 150,
};

const layoutStyle = {
  overflow: "hidden",
};

function Transaction() {
  const [amount, setAmount] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );

  const { data: services, isLoading, isFetching } = useGetServices();
  const { mutate } = usePostTransaction(() => {
    setIsSuccessModalOpen(true);
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetTransactionHistory();

  const allTransactions = data?.pages?.flatMap((page) => page.records) ?? [];

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setAmount(service.service_tariff);
  };

  const handleConfirmTransaction = () => {
    const payload: TransactionFormValues = {
      service_code: selectedService?.service_code,
    };

    mutate(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (data: any) => {
        setResponseError(data?.response?.data?.message || "Network error");
        setIsModalOpen(false);
        setIsErrorModalOpen(true);
      },
    });

    setIsModalOpen(false);
  };

  return (
    <>
      <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
          <Navbar />

          <Content style={contentStyle} className="min-h-screen py-5">
            <ProfileBalanceCard />

            <div className="pt-5 custom-tabs">
              <Tabs
                type="card"
                defaultActiveKey="1"
                tabBarStyle={{ color: "#F4271A" }}
                items={[
                  {
                    label: "Transaksi",
                    key: "1",
                    children:
                      isLoading && isFetching ? (
                        <div className="h-80">
                          <Spin tip="Mohon tunggu.." size="large">
                            Mohon tunggu...
                          </Spin>
                        </div>
                      ) : (
                        <>
                          <div className="font-semibold text-slate-500">
                            Silahkan pilih layanan yang ingin di bayar
                          </div>
                          <div className="grid grid-cols-6 gap-6 mt-3">
                            {services?.map((item: ServiceItem) => {
                              const isSelected =
                                selectedService?.service_code ===
                                item.service_code;
                              return (
                                <div
                                  key={item.service_code}
                                  onClick={() => handleSelectService(item)}
                                  className={`flex flex-col items-center justify-center gap-3 bg-white rounded-xl p-4 cursor-pointer transition-all duration-200
                                hover:scale-105 ${
                                  isSelected
                                    ? "border-2 border-[#F4271A]"
                                    : "border border-gray-200"
                                }`}
                                >
                                  <img
                                    src={item.service_icon}
                                    alt={item.service_name}
                                    className="w-10 h-10 object-contain"
                                  />
                                  <h3 className="text-xs font-semibold text-gray-700 text-center">
                                    {item.service_name}
                                  </h3>
                                </div>
                              );
                            })}
                          </div>
                          <div className="pt-4">
                            <div className="text-xl font-semibold text-slate-500 py-5">
                              PemBayaran
                            </div>

                            {selectedService ? (
                              <div className="flex items-center gap-3 pb-5">
                                <img
                                  src={selectedService?.service_icon}
                                  alt={selectedService?.service_name}
                                  className="w-8 h-8 object-contain"
                                />
                                <h3 className="text-xl font-semibold text-gray-700">
                                  {selectedService?.service_name}
                                </h3>
                              </div>
                            ) : (
                              <div className="text-lg font-semibold text-slate-500 pb-5">
                                Silahkan pilih layanan
                              </div>
                            )}

                            <Row>
                              <Col flex="auto" className="mr-3">
                                <InputNumber
                                  addonBefore={<CreditCardOutlined />}
                                  style={{ width: "100%" }}
                                  prefix="Rp "
                                  size="large"
                                  disabled
                                  value={amount ?? undefined}
                                  formatter={(value) => {
                                    if (!value) return "";
                                    const parts = value.toString().split(".");
                                    const integerPart = parts[0].replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      "."
                                    );
                                    const decimalPart = parts[1]
                                      ? `,${parts[1]}`
                                      : "";
                                    return `${integerPart}${decimalPart}`;
                                  }}
                                  parser={(value) => {
                                    if (!value) return 0;
                                    return parseInt(
                                      value.replace(/\./g, ""),
                                      10
                                    );
                                  }}
                                />

                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  size="large"
                                  className="w-full my-3"
                                  style={{
                                    backgroundColor: "#F4271A",
                                    color: "#FFFFFF",
                                  }}
                                  onClick={() => setIsModalOpen(true)}
                                >
                                  Bayar
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        </>
                      ),
                  },
                  {
                    label: "History Transaksi",
                    key: "2",
                    children: (
                      <>
                        <div className="p-5">
                          <h2 className="text-xl font-bold text-slate-500">
                            Semua Transaksi History
                          </h2>

                          <p className="text-sm mb-4 text-slate-500">
                            <span className="text-red-500">*</span> Saat ini
                            hanya ada transaksi bulan ini{" "}
                            <span className="font-bold">Oktober</span> saja
                          </p>

                          <div className="flex flex-wrap gap-2 mb-5">
                            {[
                              "Januari",
                              "Februari",
                              "Maret",
                              "April",
                              "Mei",
                              "Juni",
                              "Juli",
                              "Agustus",
                              "September",
                              "Oktober",
                              "November",
                              "Desember",
                            ].map((month, index) => (
                              <Button
                                key={month}
                                style={{
                                  backgroundColor: "#FFF",
                                  color: "#F4271A",
                                }}
                                className={`${
                                  selectedMonth === index + 1
                                    ? "bg-[#F4271A] text-white"
                                    : ""
                                }`}
                                size="small"
                                onClick={() =>
                                  setSelectedMonth(
                                    selectedMonth === index + 1
                                      ? null
                                      : index + 1
                                  )
                                }
                              >
                                {month}
                              </Button>
                            ))}
                          </div>

                          {(() => {
                            const filteredTransactions = allTransactions.filter(
                              (item) => {
                                if (!selectedMonth) return true;
                                const month =
                                  new Date(item.created_on).getMonth() + 1;
                                return month === selectedMonth;
                              }
                            );

                            const visibleTransactions = expanded
                              ? filteredTransactions
                              : filteredTransactions.slice(0, 5);

                            return (
                              <>
                                {filteredTransactions.length > 0 ? (
                                  <div className="flex flex-col gap-3">
                                    {visibleTransactions.map((item) => (
                                      <Card key={item.invoice_number}>
                                        <div className="flex justify-between items-center">
                                          <div>
                                            {item.transaction_type ===
                                            "TOPUP" ? (
                                              <p className="text-lg font-bold text-green-400">
                                                + Rp{" "}
                                                {item.total_amount.toLocaleString(
                                                  "id-ID"
                                                )}
                                              </p>
                                            ) : (
                                              <p className="text-lg font-bold text-red-400">
                                                - Rp{" "}
                                                {item.total_amount.toLocaleString(
                                                  "id-ID"
                                                )}
                                              </p>
                                            )}
                                            <p className="text-xs font-medium text-gray-400 pt-2">
                                              {new Date(
                                                item.created_on
                                              ).toLocaleString("id-ID")}
                                            </p>
                                          </div>

                                          {item.transaction_type === "TOPUP" ? (
                                            <p className="text-xs font-medium text-gray-600">
                                              Top Up Saldo
                                            </p>
                                          ) : (
                                            <p className="text-xs font-medium text-gray-600">
                                              Pembayaran {item.description}
                                            </p>
                                          )}
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center text-gray-500 py-10 h-[250px]">
                                    Tidak ada transaksi di bulan ini.
                                  </div>
                                )}

                                {filteredTransactions.length > 5 && (
                                  <div className="text-center mt-5 flex justify-center items-center gap-2">
                                    {hasNextPage && expanded && (
                                      <Button
                                        onClick={() => fetchNextPage()}
                                        loading={isFetchingNextPage}
                                        type="primary"
                                        style={{
                                          backgroundColor: "#F4271A",
                                          borderColor: "#F4271A",
                                        }}
                                      >
                                        {isFetchingNextPage
                                          ? "Memuat..."
                                          : "Tampilkan Lebih Banyak"}
                                      </Button>
                                    )}

                                    <Button
                                      type="default"
                                      onClick={() => setExpanded(!expanded)}
                                      className="text-[#F4271A] border-[#F4271A]"
                                    >
                                      {expanded
                                        ? "Tutup Riwayat"
                                        : "Lihat Semua"}
                                    </Button>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </Content>

          <Footer style={footerStyle}>
            <div className="text-center text-white">
              &copy; 2025 SIMS PPOB - Elyas Purba Prastiya. All rights reserved.
            </div>
          </Footer>
        </Layout>
      </Flex>

      <ConfirmModal
        open={isModalOpen}
        amount={amount}
        onConfirm={handleConfirmTransaction}
        onCancel={() => setIsModalOpen(false)}
        title={`Pembayaran ${selectedService?.service_name ?? ""} senilai`}
        okText="Ya, Lanjutkan Bayar"
      />

      <SuccessModal
        open={isSuccessModalOpen}
        amount={amount}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setAmount(0);
        }}
        title_success="Pembayaran Berhasil"
        secound_title={`${
          selectedService?.service_name ?? ""
        } berhasil dibayar senilai`}
      />

      <ErrorModal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title_error="Pembayaran Gagal"
        second_title={
          <>
            Pembayaran{" "}
            <span className="font-semibold text-[#F4271A]">
              {selectedService?.service_name ?? ""}
            </span>{" "}
            gagal karena{" "}
            <span className="font-medium text-red-500">{responseError}</span>
          </>
        }
      />
    </>
  );
}

export default Transaction;
