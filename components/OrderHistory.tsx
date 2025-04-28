// components/OrderHistory.tsx

interface Order {
  id: string;
  date: string;
  total: string | number;
  items: number;
  status: "completed" | "paid" | "placed" | "cancelled" | string;
}

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <div className="order-history mt-3 bg-white p-3 rounded-lg border border-gray-200">
      <h3 className="font-bold mb-2">Order History</h3>
      {orders.length === 0 ? (
        <p className="text-gray-500">No previous orders found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order.id} className="py-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">
                    Order #{order.id.slice(-5)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {order.date}
                  </span>
                </div>
                <span>{order.total}</span>
              </div>
              <div className="mt-1 text-sm">
                <span className="text-gray-600">{order.items} item(s)</span>
                <span
                  className="ml-3 px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor:
                      order.status === "completed"
                        ? "#e6f7ee"
                        : order.status === "paid"
                        ? "#e6f2ff"
                        : order.status === "placed"
                        ? "#fff3e6"
                        : "#f7e6e6",
                    color:
                      order.status === "completed"
                        ? "#0d9f6e"
                        : order.status === "paid"
                        ? "#0369a1"
                        : order.status === "placed"
                        ? "#d97706"
                        : "#dc2626",
                  }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
