// app/payment/verify/[orderId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface VerifyPaymentProps {
  params: {
    orderId: string;
  };
}

export default function VerifyPayment({ params }: VerifyPaymentProps) {
  const { orderId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

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
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        {status === "processing" && (
          <div className="mx-auto w-16 h-16 mb-4 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
        )}

        {status === "success" && (
          <div className="mx-auto w-16 h-16 mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto w-16 h-16 mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-2">
          {status === "processing"
            ? "Processing Payment"
            : status === "success"
            ? "Payment Successful!"
            : "Payment Failed"}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="mt-4">
          {status === "processing" ? (
            <p className="text-sm text-gray-500">
              Please do not close this page...
            </p>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Return to Chat
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
