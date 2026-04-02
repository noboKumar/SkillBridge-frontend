import { axiosInstance } from "@/lib/axios";

export const getMe = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data.data;
};
