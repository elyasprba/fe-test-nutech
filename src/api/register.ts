import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { RegisterFormValues } from "../pages/register";

const baseURL = import.meta.env.VITE_BASE_URL;

export function usePostRegister() {
  return useMutation({
    mutationKey: ["register-user"],
    mutationFn: async (payload: RegisterFormValues) => {
      const res = await axios.post(`${baseURL}/registration`, payload);

      return res.data;
    }
  });
}
