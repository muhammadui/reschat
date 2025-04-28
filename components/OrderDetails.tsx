// components/OrderDetails.tsx

interface OrderOption {
  name: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: string | number;
  options?: OrderOption[];
}

interface Order {
  items: OrderItem[];
  total: string | number;
}

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="order-details mt-3 bg-white p-3 rounded-lg border border-gray-200">
      <h3 className="font-bold mb-2">Order Details</h3>
      <ul className="divide-y divide-gray-200">
        {order.items.map((item, index) => (
          <li key={index} className="py-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  x{item.quantity}
                </span>
              </div>
              <span>{item.price}</span>
            </div>
            {item.options && item.options.length > 0 && (
              <ul className="mt-1 pl-4 text-sm text-gray-600">
                {item.options.map((option, idx) => (
                  <li key={idx}>+ {option.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-bold">
        <span>Total:</span>
        <span>{order.total}</span>
      </div>
    </div>
  );
}
