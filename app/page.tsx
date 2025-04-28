// app/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import InputArea from "@/components/InputArea";
import PaymentModal from "@/components/PaymentModal";

// Types
interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: Date;
  isTyping?: boolean;
  menuItems?: any[];
  order?: any;
  orderHistory?: any[];
}

interface Option {
  id: string;
  text: string;
}

interface PaymentInfo {
  orderId: string;
  formattedAmount: string;
  [key: string]: any;
}

export default function Home() {
  const [deviceId, setDeviceId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [options, setOptions] = useState<Option[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const storedDeviceId = localStorage.getItem("deviceId");

    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
      initializeChat(storedDeviceId);
    } else {
      const newDeviceId = uuidv4();
      localStorage.setItem("deviceId", newDeviceId);
      setDeviceId(newDeviceId);
      initializeChat(newDeviceId);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async (deviceId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/chat/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });

      const data = await response.json();

      setMessages([
        {
          id: uuidv4(),
          from: "bot",
          text: data.message,
          timestamp: new Date(),
        },
      ]);

      if (data.options) {
        setOptions(data.options);
      }
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      setMessages([
        {
          id: uuidv4(),
          from: "bot",
          text: "Sorry, there was an error connecting to the restaurant. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessageId = uuidv4();
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        from: "user",
        text,
        timestamp: new Date(),
      },
    ]);

    setOptions([]);

    setMessages((prev) => [
      ...prev,
      {
        id: "typing-indicator",
        from: "bot",
        isTyping: true,
        text: "",
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await fetch(`${API_URL}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, message: text }),
      });

      const data = await response.json();

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "typing-indicator")
      );

      const botMessageId = uuidv4();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: botMessageId,
            from: "bot",
            text:
              data.message ||
              "Sorry, there was an error processing your request.",
            timestamp: new Date(),
          },
        ]);
      } else {
        const newMessage: Message = {
          id: botMessageId,
          from: "bot",
          text: data.message,
          timestamp: new Date(),
        };

        if (data.paymentInfo) {
          setPaymentInfo(data.paymentInfo);
          setShowPaymentModal(true);
        }

        if (data.items) {
          newMessage.menuItems = data.items;
        } else if (data.order) {
          newMessage.order = data.order;
        } else if (data.orders) {
          newMessage.orderHistory = data.orders;
        }

        setMessages((prev) => [...prev, newMessage]);

        if (data.options) {
          setOptions(data.options);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "typing-indicator")
      );
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          from: "bot",
          text: "Sorry, there was an error communicating with the restaurant. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleOptionClick = (option: Option) => {
    sendMessage(option.id);
  };

  const handlePaymentComplete = (status: string, reference: string) => {
    setShowPaymentModal(false);

    if (status === "success") {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          from: "bot",
          text: "Your payment was successful! Your order has been placed. Thank you for ordering with us!",
          timestamp: new Date(),
        },
      ]);

      setOptions([
        { id: "1", text: "Place a new order" },
        { id: "98", text: "See order history" },
        { id: "main", text: "Back to main menu" },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          from: "bot",
          text: "There was an issue with your payment. Please try again or choose another payment method.",
          timestamp: new Date(),
        },
      ]);

      setOptions([
        { id: "pay", text: "Try payment again" },
        { id: "main", text: "Back to main menu" },
      ]);
    }
  };

  return (
    <main className="chat-container">
      <ChatHeader />

      <ChatMessages
        messages={messages}
        options={options}
        onOptionClick={handleOptionClick}
        messagesEndRef={messagesEndRef}
      />

      <InputArea onSendMessage={sendMessage} />

      {showPaymentModal && paymentInfo && (
        <PaymentModal
          paymentInfo={paymentInfo}
          onClose={() => setShowPaymentModal(false)}
          onComplete={handlePaymentComplete}
          deviceId={deviceId}
        />
      )}
    </main>
  );
}
