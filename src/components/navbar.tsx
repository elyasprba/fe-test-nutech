import { Popover } from "antd";
import { useState } from "react";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../utils/dispatch";
import { clearToken } from "../redux/auth-slice";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { profile_image } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white py-6 px-36 flex justify-between items-center border-b border-gray-200">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src="../src/assets/image/Logo.png"
          alt="Logo SIMS PPOB"
          className="w-6 h-6"
        />
        <h2 className="text-xl font-bold">SIMS PPOB - Elyas Purba Prastiya</h2>
      </div>

      <div className="flex gap-8 text-gray-600 font-semibold text-lg items-center">
        <div
          className={`cursor-pointer hover:text-[#F4271A] ${
            isActive("/topup") ? "text-[#F4271A]" : ""
          }`}
          onClick={() => navigate("/topup")}
        >
          Top up
        </div>
        <div
          className={`cursor-pointer hover:text-[#F4271A] ${
            isActive("/transaction") ? "text-[#F4271A]" : ""
          }`}
          onClick={() => navigate("/transaction")}
        >
          Transaction
        </div>

        <Popover
          content={
            <div className="text-md w-24">
              <div
                className={`mb-2 cursor-pointer hover:text-[#F4271A] font-semibold ${
                  isActive("/profile") ? "text-[#F4271A]" : ""
                }`}
                onClick={() => navigate("/profile")}
              >
                <UserOutlined /> Profile
              </div>
              <div
                className="cursor-pointer hover:text-[#F4271A] font-semibold"
                onClick={() => dispatch(clearToken())}
              >
                <LogoutOutlined style={{ color: "#F4271A" }} /> Logout
              </div>
            </div>
          }
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <img
            src={
              profile_image && !profile_image.endsWith("/null")
                ? profile_image
                : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
            }
            className="w-[40px] h-[40px] cursor-pointer rounded-full border border-gray-300"
          />
        </Popover>
      </div>
    </div>
  );
}

export default Navbar;
