import { Badge, Button, Flex, Form, Input, Layout, Modal, Tooltip } from "antd";
import Navbar from "../../components/navbar";
import { Content, Footer } from "antd/es/layout/layout";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { clearToken } from "../../redux/auth-slice";
import { useAppDispatch, useAppSelector } from "../../utils/dispatch";
import { usePatchProfile, useUpdateProfileImage } from "../../api/profile";
import { capitalize } from "../../utils/capitalize";

export type ProfileFormValues = {
  email: string;
  first_name: string;
  last_name: string;
};

const contentStyle: React.CSSProperties = {
  color: "#000",
  backgroundColor: "#fff",
  paddingInline: 300,
  display: "flex",
  justifyContent: "center",
};

const footerStyle: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#F4271A",
  paddingInline: 150,
};

const layoutStyle = {
  overflow: "hidden",
};

function Profile() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const { email, first_name, last_name, profile_image } = useAppSelector(
    (state) => state.auth
  );

  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate: updateProfile, isPending: isUpdatePending } =
    usePatchProfile();
  const { mutate: updateImage, isPending } = useUpdateProfileImage();

  const onFinish = async () => {
    const values = await form.validateFields();

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      updateImage(formData, {
        onSuccess: () => {
          setSelectedFile(null);
          setPreview(null);
          setIsEdit(false);
        },
        onError: (err) => {
          console.error("Upload gagal:", err);
        },
      });

      return;
    }

    updateProfile(values, {
      onSuccess: () => {
        setIsEdit(false);
      },
      onError: (err) => {
        console.error("Update profil gagal:", err);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setSelectedFile(file);
    setIsEdit(true);

    e.target.value = "";
  };

  return (
    <>
      <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
          <Navbar />

          <Content
            style={contentStyle}
            className="min-h-screen py-5 flex flex-col justify-center items-center"
          >
            <Form
              form={form}
              name="horizontal_login"
              layout="vertical"
              className="max-w-lg w-full"
              disabled={!isEdit}
              initialValues={{
                email: email,
                first_name: first_name,
                last_name: last_name,
              }}
            >
              <div className="text-center">
                <div className="flex flex-col gap-3 items-center mb-8">
                  <Badge
                    offset={[-20, 130]}
                    count={
                      <div>
                        <Tooltip title="Edit Foto Profile" placement="topLeft">
                          <EditOutlined
                            className={`text-2xl cursor-pointer bg-white border border-gray-400 rounded-full p-2 shadow-lg ${
                              isPending ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            style={{ color: "#4A5464", fontSize: "15px" }}
                            onClick={() => {
                              if (isPending) return;
                              document.getElementById("fileInput")?.click();
                            }}
                          />
                        </Tooltip>
                      </div>
                    }
                  >
                    <img
                      src={
                        preview ||
                        (profile_image && !profile_image.endsWith("/null")
                          ? profile_image
                          : "https://api.dicebear.com/7.x/miniavs/svg?seed=1")
                      }
                      alt="Foto profil"
                      className="w-[150px] h-[150px] rounded-full border border-gray-400 object-cover"
                    />
                  </Badge>

                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  <h2 className="text-2xl font-semibold pt-3">
                    {capitalize(first_name)} {capitalize(last_name)}
                  </h2>
                </div>
              </div>

              <Form.Item
                name="email"
                layout="vertical"
                label="Email"
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
                layout="vertical"
                label="Nama Depan"
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
                layout="vertical"
                label="Nama Belakang"
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
            </Form>

            {isEdit ? (
              <div className="max-w-lg w-full pb-15">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full my-3"
                  style={{
                    backgroundColor: "#F4271A",
                  }}
                  onClick={onFinish}
                  loading={isPending || isUpdatePending}
                >
                  Simpan
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full"
                  style={{
                    backgroundColor: "#fff",
                    color: "#F4271A",
                    border: "1px solid #F4271A",
                  }}
                  onClick={() => {
                    setIsEdit(false);
                    setPreview(null);
                  }}
                >
                  Batalkan
                </Button>
              </div>
            ) : (
              <div className="max-w-lg w-full pb-15">
                <Button
                  htmlType="submit"
                  size="large"
                  className="w-full my-3"
                  style={{
                    backgroundColor: "#F4271A",
                    borderColor: "#F4271A",
                    color: "#fff",
                  }}
                  onClick={() => setIsEdit(true)}
                >
                  Edit Profile
                </Button>

                <Button
                  type="primary"
                  size="large"
                  className="w-full"
                  style={{
                    backgroundColor: "#fff",
                    color: "#F4271A",
                    border: "1px solid #F4271A",
                  }}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
          </Content>

          <Footer style={footerStyle}>
            <div className="text-center text-white">
              &copy; 2025 SIMS PPOB - Elyas Purba prastiya. All rights reserved.
            </div>
          </Footer>
        </Layout>
      </Flex>

      <Modal
        closable={false}
        open={isModalOpen}
        centered
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
          dispatch(clearToken());
        }}
        style={{ borderRadius: "20px" }}
        okText="Batal"
        cancelText="Ya, Keluar"
        okButtonProps={{
          style: {
            backgroundColor: "#F4271A",
            borderColor: "#F4271A",
          },
        }}
        cancelButtonProps={{
          style: {
            color: "#F4271A",
            borderColor: "#F4271A",
          },
        }}
      >
        <p className="text-lg font-semibold">Apakah anda yakin ingin keluar?</p>
      </Modal>
    </>
  );
}

export default Profile;
