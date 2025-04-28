// components/ChatMessages.tsx
import { formatRelative } from "date-fns";
import { RefObject } from "react";
import MenuItem from "@/components/MenuItem";
import OrderDetails from "@/components/OrderDetails";
import OrderHistory from "@/components/OrderHistory";

interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: string | number;
  [key: string]: any;
}

interface OrderType {
  [key: string]: any;
}
interface Order {
  [key: string]: any;
}

// Import the Order type from OrderDetails

interface MessageType {
  id: string;
  from: "bot" | "user";
  text: string;
  timestamp?: string | Date;
  isTyping?: boolean;
  menuItems?: MenuItemType[];
  order?: Order;
  orderHistory?: OrderType[];
}

interface OptionType {
  id: string;
  text: string;
}

interface ChatMessagesProps {
  messages: MessageType[];
  options: OptionType[];
  onOptionClick: (option: OptionType) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  options,
  onOptionClick,
  messagesEndRef,
}: ChatMessagesProps) {
  const formatMessageTime = (timestamp?: string | Date) => {
    if (!timestamp) return "";
    return formatRelative(new Date(timestamp), new Date());
  };

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <div key={message.id}>
          {message.isTyping ? (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          ) : (
            <div
              className={`message ${
                message.from === "bot" ? "bot-message" : "user-message"
              }`}
            >
              <div>{message.text}</div>

              {/* Render menu items if available */}
              {message.menuItems && (
                <div className="mt-4 ">
                  {message.menuItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      onSelect={() =>
                        onOptionClick({ id: item.id, text: item.name })
                      }
                    />
                  ))}
                </div>
              )}

              {/* Render order details if available */}
              {message.order && <OrderDetails order={message.order} />}

              {/* Render order history if available */}
              {message.orderHistory && (
                <OrderHistory orders={message.orderHistory} />
              )}

              <div className="message-time">
                {formatMessageTime(message.timestamp)}
              </div>
            </div>
          )}
        </div>
      ))}

      {options && options.length > 0 && (
        <div className="options-container">
          {options.map((option) => (
            <button
              key={option.id}
              className="option-button"
              onClick={() => onOptionClick(option)}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
