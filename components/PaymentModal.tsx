// components/PaymentModal.tsx
import { useState } from "react";

interface PaymentInfo {
  orderId: string;
  formattedAmount: string;
}

interface PaymentModalProps {
  paymentInfo: PaymentInfo;
  onClose: () => void;
  onComplete: (status: string, reference: string) => void;

  deviceId?: string;
}

export default function PaymentModal({
  paymentInfo,
  onClose,
}: PaymentModalProps) {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const initializePayment = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/payments/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: paymentInfo.orderId,
          email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.data.authorization_url;
      } else {
        setError(data.error || "Failed to initialize payment");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
      console.error("Payment initialization error:", err);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order Total:</span>
            <span className="font-bold">{paymentInfo.formattedAmount}</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Please enter your email to receive the payment receipt.
          </p>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={initializePayment}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
