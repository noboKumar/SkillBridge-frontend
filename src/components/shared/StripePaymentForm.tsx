"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck, X } from "lucide-react";

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  tutorName: string;
  slotInfo: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#1e293b",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "15px",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
};

export default function StripePaymentForm({
  clientSecret,
  amount,
  tutorName,
  slotInfo,
  onSuccess,
  onCancel,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      },
    );

    if (error) {
      setCardError(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Hand off to parent — it will create the booking
      onSuccess(paymentIntent.id);
    } else {
      setCardError("Payment was not completed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order Summary */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Order Summary
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-slate-800">Session with {tutorName}</p>
            <p className="text-sm text-slate-500">{slotInfo}</p>
          </div>
          <p className="text-2xl font-black text-sky-600">${amount}</p>
        </div>
      </div>

      {/* Card Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Card Information
        </label>
        <div className="border border-slate-200 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-all bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <X size={14} /> {cardError}
          </p>
        )}
      </div>

      {/* Test card hint */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
        <strong>Test Mode:</strong> Use card{" "}
        <code className="bg-amber-100 px-1 rounded">4242 4242 4242 4242</code>
        , any future date, any CVC.
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 py-2.5 rounded-xl font-semibold transition-all"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing...
            </>
          ) : (
            <>
              <ShieldCheck size={16} /> Pay ${amount}
            </>
          )}
        </button>
      </div>

      {/* Security note */}
      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
        <ShieldCheck size={12} /> Secured by Stripe. Your payment info is never
        stored.
      </p>
    </form>
  );
}
