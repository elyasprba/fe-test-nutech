import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../utils/dispatch";
import axiosInstance from "./axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

export function useGetBalance() {
  const token = useAppSelector((state) => state.auth.token);

  return useQuery({
    queryKey: ["get-balance"],
    queryFn: async () => {
      const res = await axiosInstance.get(`${baseURL}/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data?.data;
    },
    enabled: !!token,
  });
}
