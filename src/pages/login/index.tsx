import { Button, Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { usePostLogin } from "../../api/login";
import { useMessageApi } from "../../context/MessageProvider";
import { useAppDispatch } from "../../utils/dispatch";
import { setToken } from "../../redux/auth-slice";
import IllustrationLogin from "../../assets/image/Illustrasi-Login.png";
import Logo from "../../assets/image/Logo.png";

export type LoginFormValues = {
  email: string;
  password: string;
};

function Login() {
  const [form] = Form.useForm();
  const message = useMessageApi();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { mutate, isPending } = usePostLogin();

  const onFinish = (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: (data) => {
        message.success(data?.message || "Registrasi berhasil silahkan login");
        dispatch(setToken(data?.data?.token));
        navigate("/dashboard");
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
                <img src={Logo} alt="Logo SIMS PPOB" className="w-8 h-8" />
                <h2 className="text-2xl font-semibold">SIMS PPOB</h2>
              </div>

              <h2 className="text-3xl font-semibold mt-8 mb-16">
                Masuk atau buat akun <br /> untuk memulai
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

            <Form.Item shouldUpdate className="mt-4">
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full my-6"
                  style={{
                    backgroundColor: "#F4271A",
                    color: "#FFFFFF",
                  }}
                  disabled={isPending}
                  loading={isPending}
                >
                  Login
                </Button>
              )}
            </Form.Item>

            <div className="text-center">
              <p>
                Belum punya akun? register{" "}
                <span
                  className="text-[#F4271A] font-semibold cursor-pointer"
                  onClick={() => {
                    navigate("/register");
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
            backgroundImage: `url(${IllustrationLogin})`,
          }}
        ></div>
      </div>
    </>
  );
}

export default Login;
