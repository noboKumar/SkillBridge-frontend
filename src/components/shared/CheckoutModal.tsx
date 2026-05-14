"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StripePaymentForm from "./StripePaymentForm";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

interface CheckoutModalProps {
  isOpen: boolean;
  clientSecret: string;
  amount: number;
  tutorName: string;
  slotInfo: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

export default function CheckoutModal({
  isOpen,
  clientSecret,
  amount,
  tutorName,
  slotInfo,
  onSuccess,
  onCancel,
}: CheckoutModalProps) {
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    if (isOpen && clientSecret) {
      setStripeReady(true);
    }
  }, [isOpen, clientSecret]);

  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#0284c7",
        colorBackground: "#ffffff",
        colorText: "#1e293b",
        colorDanger: "#ef4444",
        fontFamily: "Inter, Segoe UI, sans-serif",
        borderRadius: "12px",
      },
    },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent accidental closing — user must explicitly cancel or pay
        if (!open) return;
      }}
    >
      <DialogContent
        className="sm:max-w-md rounded-2xl p-0 overflow-hidden"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 px-6 pt-6 pb-5">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold">
              Complete Your Booking
            </DialogTitle>
            <p className="text-sky-100 text-sm mt-1">
              You're just one step away from booking your session!
            </p>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {!stripeReady || !clientSecret ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-500">
              <Loader2 className="animate-spin" size={28} />
              <p className="text-sm">Preparing checkout...</p>
            </div>
          ) : (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <StripePaymentForm
                clientSecret={clientSecret}
                amount={amount}
                tutorName={tutorName}
                slotInfo={slotInfo}
                onSuccess={onSuccess}
                onCancel={onCancel}
              />
            </Elements>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
