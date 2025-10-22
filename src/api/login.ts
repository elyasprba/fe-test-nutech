import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { LoginFormValues } from "../pages/login";

const baseURL = import.meta.env.VITE_BASE_URL;

export function usePostLogin() {
  return useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (payload: LoginFormValues) => {
      const res = await axios.post(`${baseURL}/login`, payload);

      return res.data;
    }
  });
}
