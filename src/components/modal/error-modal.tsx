import { Modal } from "antd";
import { CloseCircleTwoTone } from "@ant-design/icons";

interface ErrorModalProps {
  open: boolean;
  title_error: string;
  second_title?: React.ReactNode;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  title_error,
  second_title,
  onClose,
}) => {
  return (
    <Modal
      closable={false}
      open={open}
      centered
      onOk={onClose}
      okText="Tutup"
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{
        style: {
          backgroundColor: "#fff",
          borderColor: "#F4271A",
          color: "#F4271A",
          fontWeight: "bold",
        },
      }}
      width={320}
    >
      <div className="flex flex-col items-center justify-center py-7">
        <CloseCircleTwoTone
          twoToneColor="#F4271A"
          style={{ fontSize: "50px" }}
        />
        <p className="text-lg font-semibold mt-4 text-center text-red-600">
          {title_error}
        </p>
        <p className="text-center text-gray-500 text-sm mt-2">{second_title}</p>
      </div>
    </Modal>
  );
};

export default ErrorModal;
