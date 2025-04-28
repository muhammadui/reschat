// components/InputArea.tsx
import { useState, FormEvent, ChangeEvent } from "react";

interface InputAreaProps {
  onSendMessage: (message: string) => void;
}

export default function InputArea({ onSendMessage }: InputAreaProps) {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-container">
      <input
        type="text"
        className="chat-input"
        placeholder="Type your message..."
        value={message}
        onChange={handleChange}
      />
      <button type="submit" className="send-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
}
