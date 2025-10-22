import { Modal } from "antd";

interface ConfirmModalProps {
  open: boolean;
  amount: number | null;
  title: string;
  okText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  amount,
  onConfirm,
  onCancel,
  title,
  okText,
}) => {
  return (
    <Modal
      closable={false}
      open={open}
      centered
      onOk={onConfirm}
      onCancel={onCancel}
      style={{ borderRadius: "20px" }}
      okText={okText}
      cancelText="Batalkan"
      okButtonProps={{
        style: {
          backgroundColor: "#fff",
          borderColor: "#F4271A",
          color: "#F4271A",
          fontWeight: "bold",
        },
      }}
      cancelButtonProps={{
        style: {
          color: "#C7C2C2",
          borderColor: "#C7C2C2",
        },
      }}
      width={320}
    >
      <div className="flex flex-col gap-3 items-center justify-center py-7">
        <img src="../src/assets/image/Logo.png" alt="logo" />
        <div className="text-center">
          <p className="text-md font-semibold">{title}</p>
          <p>
            <span className="text-2xl font-bold">
              Rp. {amount?.toLocaleString("id-ID")}
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
