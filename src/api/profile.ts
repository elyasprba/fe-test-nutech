import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../utils/dispatch";
import type { ProfileFormValues } from "../pages/profile";
import { useMessageApi } from "../context/MessageProvider";
import { setProfile } from "../redux/auth-slice";
import axiosInstance from "./axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

export function useGetProfile() {
  const token = useAppSelector((state) => state.auth.token);

  return useQuery({
    queryKey: ["get-profile"],
    queryFn: async () => {
      const res = await axiosInstance.get(`${baseURL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data?.data;
    },
    enabled: !!token,
  });
}

export function usePatchProfile() {
  const token = useAppSelector((state) => state.auth.token);

  const message = useMessageApi();

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-profile"],
    mutationFn: async (payload: ProfileFormValues) => {
      const res = await axiosInstance.put(
        `${baseURL}/profile/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      message.success("Update profile berhasil");
      dispatch(
        setProfile({
          email: data?.data?.email || "",
          first_name: data?.data?.first_name || "",
          last_name: data?.data?.last_name || "",
          profile_image: data?.data?.profile_image || "",
        })
      );
    },
  });
}

export const useUpdateProfileImage = () => {
  const token = useAppSelector((state) => state.auth.token);

  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();
  const message = useMessageApi();

  return useMutation({
    mutationKey: ["update-profile-image"],
    mutationFn: async (formData: FormData) => {
      const res = await axiosInstance.put(
        `${baseURL}/profile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      message.success("Foto profile berhasil");

      dispatch(
        setProfile({
          email: data?.data?.email || "",
          first_name: data?.data?.first_name || "",
          last_name: data?.data?.last_name || "",
          profile_image: data?.data?.profile_image || "",
        })
      );
    },
  });
};
