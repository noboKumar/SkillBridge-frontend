"use client";

import { useLogout } from "@/hooks/useLogOut";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const logout = useLogout();
  return (
    <>
      <Button variant={"destructive"} onClick={logout}>
        Logout
      </Button>
    </>
  );
};

export default LogoutButton;
