"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function VerifyPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const reference = searchParams.get("reference");
  const orderId = pathname.split("/").pop(); // Extract `orderId` from the URL path

  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [message, setMessage] = useState<string>("Verifying your payment...");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (reference) {
      verifyPayment();
    } else {
      setStatus("error");
      setMessage("Invalid payment reference. Please try again.");
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(`${API_URL}/payments/verify/${reference}`);
      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage("Payment successful! Your order has been confirmed.");

        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(
          "Payment verification failed. Please try again or contact support."
        );
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("error");
      setMessage(
        "An error occurred while verifying your payment. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* your JSX */}
    </div>
  );
}
