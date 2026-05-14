"use client";

import { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import CheckoutModal from "./CheckoutModal";

export default function BookingCard({ tutor }: { tutor: any }) {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Checkout modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const { user } = useAuth();
  const router = useRouter();

  const slots = (tutor?.availabilitySlots || []).filter(
    (slot: any) => !slot.isBooked,
  );

  const selectedSlotData = slots.find((s: any) => s.id === selectedSlot);

  const handleBookSession = async () => {
    if (!user) {
      toast.error("Please login to book a session");
      router.push("/login");
      return;
    }

    if (user.role !== "STUDENT") {
      toast.error("Only students can book sessions");
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select an availability slot");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Create a Stripe PaymentIntent (no booking created yet)
      const paymentRes = await axiosInstance.post(
        "/payment/create-payment-intent",
        {
          amount: tutor.hourlyRate,
          currency: "usd",
        },
      );
      const { clientSecret: secret } = paymentRes.data?.data;

      // Step 2: Open the checkout modal — booking is created AFTER payment succeeds
      setClientSecret(secret);
      setIsModalOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate checkout");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Step 3: Create the CONFIRMED booking only after payment succeeds
      await axiosInstance.post("/bookings", {
        slotId: selectedSlot,
      });
      toast.success("🎉 Booking confirmed! Payment successful.");
      setIsModalOpen(false);
      setSelectedSlot("");
      router.push("/dashboard/student/bookings");
    } catch (error: any) {
      toast.error(
        "Payment succeeded but booking failed. Please contact support with your payment ID: " +
          paymentIntentId,
      );
    }
  };

  const handlePaymentCancel = () => {
    // Just close the modal — no booking was created
    setIsModalOpen(false);
    toast.info("Booking cancelled.");
  };

  const slotInfo = selectedSlotData
    ? `${Array.isArray(selectedSlotData.daysOfWeek) ? selectedSlotData.daysOfWeek.join(", ") : selectedSlotData.daysOfWeek}: ${selectedSlotData.startTime} – ${selectedSlotData.endTime}`
    : "";

  const tutorName =
    tutor?.user?.name?.charAt(0).toUpperCase() + tutor?.user?.name?.slice(1);

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
        <h2 className="text-lg font-bold mb-2">Hourly Rate</h2>
        <p className="text-3xl font-black text-slate-900">${tutor.hourlyRate}</p>
        <p className="text-slate-500 mb-6">per hour</p>

        {slots.length > 0 ? (
          <div className="space-y-4 text-left mb-6">
            <label className="text-sm font-semibold text-slate-700 block">
              Available Slots
            </label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none"
            >
              <option value="">Select a time slot...</option>
              {slots.map((slot: any) => (
                <option key={slot.id} value={slot.id}>
                  {Array.isArray(slot.daysOfWeek)
                    ? slot.daysOfWeek.join(", ")
                    : slot.daysOfWeek}
                  : {slot.startTime} - {slot.endTime}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-red-500 text-sm font-medium mb-6">
            No available slots
          </p>
        )}

        <button
          onClick={handleBookSession}
          disabled={isLoading || slots.length === 0}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white py-2.5 rounded-xl font-semibold transition"
        >
          {isLoading ? "Preparing checkout..." : "Book Session"}
        </button>
      </div>

      {/* Stripe Checkout Modal */}
      {isModalOpen && clientSecret && (
        <CheckoutModal
          isOpen={isModalOpen}
          clientSecret={clientSecret}
          amount={tutor.hourlyRate}
          tutorName={tutorName}
          slotInfo={slotInfo}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </>
  );
}
