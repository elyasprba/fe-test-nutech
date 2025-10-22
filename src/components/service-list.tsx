import { Spin } from "antd";
import { useGetServices } from "../api/services";

export type ServiceItem = {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
};

function ServiceList() {
  const { data: services, isLoading, isFetching } = useGetServices();

  if (isLoading || isFetching) {
    return (
      <div className="h-80">
        <Spin tip="Mohon tunggu.." size="large">
          Mohon tunggu...
        </Spin>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-6 mt-3">
      {services?.map((item: ServiceItem) => (
        <div
          key={item.service_code}
          className="flex flex-col items-center justify-center gap-3 bg-white rounded-xl p-4 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <img
            src={item.service_icon}
            alt={item.service_name}
            className="w-14 h-14 object-contain"
          />
          <h3 className="text-xs font-semibold text-gray-700 text-center">
            {item.service_name}
          </h3>
        </div>
      ))}
    </div>
  );
}

export default ServiceList;
