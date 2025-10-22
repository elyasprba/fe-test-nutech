import { useMutation } from "@tanstack/react-query";
import type { TopupFormValues } from "../pages/topup";
import { useAppSelector } from "../utils/dispatch";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

export function usePostTopup(onSuccessCallback?: () => void) {
  const token = useAppSelector((state) => state.auth.token);

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["topup-user"],
    mutationFn: async (payload: TopupFormValues) => {
      const res = await axiosInstance.post(`${baseURL}/topup`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-balance"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-history"] });
      if (onSuccessCallback) onSuccessCallback();
    },
  });
}
