import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../utils/dispatch";
import { useGetBalance } from "../api/balance";
import { capitalize } from "../utils/capitalize";
import { useEffect, useState } from "react";
import { useGetProfile } from "../api/profile";
import { setProfile } from "../redux/auth-slice";

export default function ProfileBalanceCard() {
  const { first_name, last_name, profile_image } = useAppSelector(
    (state) => state.auth
  );

  const dispatch = useAppDispatch();

  const { data: profileData } = useGetProfile();

  useEffect(() => {
    if (profileData) {
      dispatch(
        setProfile({
          email: profileData?.email || "",
          first_name: profileData?.first_name || "",
          last_name: profileData?.last_name || "",
          profile_image: profileData?.profile_image || "",
        })
      );
    }
  }, [profileData, dispatch]);

  const [showBalance, setShowBalance] = useState(false);

  const { data: balanceData } = useGetBalance();

  return (
    <div className="flex justify-between items-center border-b border-gray-200 pb-6">
      <div className="flex flex-col gap-3 items-start">
        <img
          src={
            profile_image && !profile_image.endsWith("/null")
              ? profile_image
              : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          }
          className="w-35 h-35 rounded-full border border-slate-200 shadow-sm"
        />
        <div>
          <h6 className="text-lg">Selamat datang,</h6>
          <h2 className="text-2xl font-semibold">
            {capitalize(first_name)} {capitalize(last_name)}
          </h2>
        </div>
      </div>

      <div className="bg-[#F4271A] h-[200px] w-[600px] rounded-xl text-white shadow-md">
        <div className="p-8 flex flex-col gap-5 h-full text-lg">
          <div className="flex items-center justify-between">
            <span>Saldo anda</span>
          </div>

          <div className="text-3xl font-bold">
            {showBalance
              ? `Rp ${balanceData?.balance?.toLocaleString("id-ID")}`
              : "Rp ••••••••"}
          </div>

          <div className="flex items-center gap-4">
            <span>Lihat saldo</span>
            <div>
              {showBalance ? (
                <EyeInvisibleOutlined
                  className="text-xl cursor-pointer"
                  onClick={() => setShowBalance(false)}
                />
              ) : (
                <EyeOutlined
                  className="text-xl cursor-pointer"
                  onClick={() => setShowBalance(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
