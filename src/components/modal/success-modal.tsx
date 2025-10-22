import { Modal } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

interface SuccessModalProps {
  open: boolean;
  amount: number | null;
  title_success: string;
  secound_title: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  amount,
  title_success,
  secound_title,
  onClose,
}) => {
  return (
    <Modal
      closable={false}
      open={open}
      centered
      onOk={onClose}
      cancelButtonProps={{ style: { display: "none" } }}
      style={{ borderRadius: "20px" }}
      okText="Oke"
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
      <div className="flex flex-col gap-3 items-center justify-center py-7 text-center">
        <CheckCircleTwoTone
          twoToneColor="#52c41a"
          style={{ fontSize: "50px" }}
        />
        <p className="text-xl font-semibold text-green-600">{title_success}</p>
        <p className="text-md text-gray-500">
          {secound_title} <br />
          <span className="text-2xl font-bold text-black">
            Rp. {amount?.toLocaleString("id-ID")}
          </span>
        </p>
      </div>
    </Modal>
  );
};

export default SuccessModal;
