"use client"
import { getMe } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  return {
    user: data?.user,
    isLoading,
    error,
  };
};