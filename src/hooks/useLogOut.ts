"use client";

import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Log out of your account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logged Out",
          text: "You have successfully logged out.",
          icon: "success",
        });
        toast.success("User logged out successfully");

        // remove token
        localStorage.removeItem("token");

        // clear all cached queries (important)
        queryClient.clear();

        // redirect
        window.location.href = "/login";
      }
    });
  };

  return logout;
};
