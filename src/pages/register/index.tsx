import { Button, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { usePostRegister } from "../../api/register";
import { useMessageApi } from "../../context/MessageProvider";
import { useNavigate } from "react-router-dom";

export type RegisterFormValues = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

function Register() {
  const [form] = Form.useForm();
  const message = useMessageApi();
  const navigate = useNavigate();

  const { mutate, isPending } = usePostRegister();

  const onFinish = async () => {
    const values = await form.validateFields();

    const payload: RegisterFormValues = {
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      password: values.password,
    };

    mutate(payload, {
      onSuccess: (data) => {
        message.success(data?.message || "Registrasi berhasil silahkan login");
        form.resetFields();
        navigate("/login");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        message.error(error?.response?.data?.message || error.message);
      },
    });
  };

  return (
    <>
      <div className="flex justify-evenly min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <Form
            form={form}
            name="horizontal_login"
            layout="vertical"
            onFinish={onFinish}
            className="w-3/4 max-w-md"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <img
                  src="../src/assets/image/Logo.png"
                  alt="Logo SIMS PPOB"
                  className="w-8 h-8"
                />
                <h2 className="text-2xl font-semibold">SIMS PPOB</h2>
              </div>

              <h2 className="text-3xl font-semibold mt-8 mb-16">
                Lengkapi data untuk <br /> membuat akun
              </h2>
            </div>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email tidak boleh kosong!" },
                { type: "email", message: "Format email tidak valid!" },
              ]}
            >
              <Input
                prefix={"@"}
                placeholder="Masukan Email"
                type="email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="first_name"
              rules={[
                { required: true, message: "Nama depan tidak boleh kosong!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nama depan"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "Nama belakang tidak boleh kosong!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nama belakang"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Password tidak boleh kosong!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Buat Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Konfirmasi Password tidak boleh kosong!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Password yang dimasukkan tidak sama!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Konfirmasi Password"
                size="large"
              />
            </Form.Item>

            <Form.Item shouldUpdate className="mt-4">
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full my-6"
                  style={{
                    backgroundColor: "#F4271A",
                  }}
                  disabled={isPending}
                  loading={isPending}
                >
                  Registrasi
                </Button>
              )}
            </Form.Item>

            <div className="text-center">
              <p>
                Sudah punya akun? login{" "}
                <span
                  className="text-[#F4271A] font-semibold cursor-pointer"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  di sini
                </span>
              </p>
            </div>
          </Form>
        </div>
        <div
          className="flex-1 bg-cover bg-center"
          style={{
            backgroundImage: "url('../src/assets/image/Illustrasi-Login.png')",
          }}
        ></div>
      </div>
    </>
  );
}

export default Register;
