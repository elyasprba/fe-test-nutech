import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { useAppSelector } from "../utils/dispatch";

const baseURL = import.meta.env.VITE_BASE_URL;

export type TransactionFormValues = {
  service_code?: string;
};

interface Transaction {
  invoice_number: string;
  transaction_type: string;
  description: string;
  total_amount: number;
  created_on: string;
}

interface HistoryResponse {
  offset: string;
  limit: string;
  records: Transaction[];
}

export function usePostTransaction(onSuccessCallback?: () => void) {
  const token = useAppSelector((state) => state.auth.token);

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["transaction-user"],
    mutationFn: async (payload: TransactionFormValues) => {
      const res = await axiosInstance.post(`${baseURL}/transaction`, payload, {
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

export function useGetTransactionHistory() {
  const token = useAppSelector((state) => state.auth.token);

  return useInfiniteQuery<HistoryResponse, Error>({
    queryKey: ["transaction-history"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(`${baseURL}/transaction/history`, {
        params: {
          offset: pageParam,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.records.length < 10 ? undefined : allPages.length + 1;
    },
  });
}
