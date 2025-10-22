import { Button, Col, Flex, InputNumber, Layout, Row } from "antd";
import Navbar from "../../components/navbar";
import { useState } from "react";
import { CreditCardOutlined } from "@ant-design/icons";
import { usePostTopup } from "../../api/topup";
import { useMessageApi } from "../../context/MessageProvider";
import ConfirmModal from "../../components/modal/confirm-modal";
import SuccessModal from "../../components/modal/success-modal";
import ErrorModal from "../../components/modal/error-modal";
import ProfileBalanceCard from "../../components/profile-balance-card";

export type TopupFormValues = {
  top_up_amount: number;
};

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

const MIN_TOPUP = 10000;
const MAX_TOPUP = 1000000;

function Topup() {
  const message = useMessageApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [amount, setAmount] = useState<number | null>(0);

  const { mutate: topupBalance } = usePostTopup(() => {
    setIsSuccessModalOpen(true);
  });
  const handleSelectAmount = (value: number) => {
    setAmount(value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleTopup = () => {
    if (!amount) {
      message.warning("Masukkan nominal top up terlebih dahulu!");
      setIsModalOpen(false);
      setAmount(0);
      return;
    }

    if (amount < MIN_TOPUP) {
      message.error(
        `Minimal top up adalah Rp ${MIN_TOPUP.toLocaleString("id-ID")}`
      );
      setIsModalOpen(false);
      setAmount(0);
      return;
    }

    if (amount > MAX_TOPUP) {
      message.error(
        `Maksimal top up adalah Rp ${MAX_TOPUP.toLocaleString("id-ID")}`
      );
      setIsModalOpen(false);
      setAmount(0);
      return;
    }

    const payload: TopupFormValues = {
      top_up_amount: amount || 0,
    };

    topupBalance(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
      },
      onError: () => {
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

            <div>
              <p className="text-lg mt-10">Silahlan Masukan</p>
              <h2 className="text-3xl font-semibold mb-10">Nominal Top Up</h2>
            </div>

            <div className="h-80">
              <div className="text-slate-400">
                Minimal top up 10.000 dan maksimal top up 1.000.000
              </div>
              <Row justify="end" gutter={6} className="mb-6">
                <Col flex="auto" className="mr-3">
                  <InputNumber
                    addonBefore={<CreditCardOutlined />}
                    style={{ width: "100%" }}
                    prefix="Rp "
                    size="large"
                    value={amount ?? undefined}
                    onChange={(value) => {
                      if (typeof value === "number" || value === null)
                        setAmount(value);
                    }}
                    formatter={(value) => {
                      if (!value) return "";
                      const parts = value.toString().split(".");
                      const integerPart = parts[0].replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        "."
                      );
                      const decimalPart = parts[1] ? `,${parts[1]}` : "";
                      return `${integerPart}${decimalPart}`;
                    }}
                    parser={(value) => {
                      if (!value) return 0;
                      return parseInt(value.replace(/\./g, ""), 10);
                    }}
                  />

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full mt-3"
                    style={{
                      backgroundColor: "#F4271A",
                      color: "#FFFFFF",
                    }}
                    onClick={openModal}
                  >
                    Top up
                  </Button>
                </Col>

                <Row gutter={16}>
                  <Col>
                    <div className="flex flex-col gap-3">
                      <Button
                        type="default"
                        size="large"
                        className="w-30"
                        onClick={() => handleSelectAmount(10000)}
                      >
                        Rp. 10.000
                      </Button>
                      <Button
                        type="default"
                        size="large"
                        className="w-30"
                        onClick={() => handleSelectAmount(100000)}
                      >
                        Rp. 100.000
                      </Button>
                    </div>
                  </Col>
                  <Col>
                    <div className="flex flex-col gap-3">
                      <Button
                        type="default"
                        size="large"
                        className="w-30"
                        onClick={() => handleSelectAmount(20000)}
                      >
                        Rp. 20.000
                      </Button>
                      <Button
                        type="default"
                        size="large"
                        className="w-30"
                        onClick={() => handleSelectAmount(250000)}
                      >
                        Rp. 250.000
                      </Button>
                    </div>
                  </Col>
                  <Col>
                    <div className="flex flex-col gap-3">
                      <Button
                        type="default"
                        size="large"
                        className="w-30"
                        onClick={() => handleSelectAmount(50000)}
                      >
                        Rp. 50.000
                      </Button>
                      <Button
                        type="default"
                        size="large"
                        className="w-30"
                        onClick={() => handleSelectAmount(500000)}
                      >
                        Rp. 500.000
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Row>
            </div>
          </Content>

          <Footer style={footerStyle}>
            <div className="text-center text-white">
              &copy; 2025 SIMS PPOB - Elyas Purba prastiya. All rights reserved.
            </div>
          </Footer>
        </Layout>
      </Flex>

      <ConfirmModal
        open={isModalOpen}
        amount={amount}
        onConfirm={handleTopup}
        onCancel={() => setIsModalOpen(false)}
        title="Anda yakin untuk Top Up sebesar"
        okText="Ya, Lanjutkan Top Up"
      />

      <SuccessModal
        open={isSuccessModalOpen}
        amount={amount}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setAmount(0);
        }}
        title_success="Berhasil Top Up"
        secound_title="Saldo Anda bertambah sebesar"
      />

      <ErrorModal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title_error="Gagal Top Up"
        second_title="Silahkan coba lagi"
      />
    </>
  );
}

export default Topup;
