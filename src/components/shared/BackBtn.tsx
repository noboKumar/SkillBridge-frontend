"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const BackBtn = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/tutors");
        }
      }}
      className="m-4"
    >
      <ArrowLeft size={18} />
      <span className="font-bold">Back</span>
    </Button>
  );
};

export default BackBtn;
