// components/MenuItem.tsx
interface MenuItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: string | number;
  };
  onSelect: () => void;
}

export default function MenuItem({ item, onSelect }: MenuItemProps) {
  return (
    <div className="menu-item cursor-pointer" onClick={onSelect}>
      <div className="menu-item-title">{item.name}</div>
      <div className="menu-item-description">{item.description}</div>
      <div className="menu-item-price">{item.price}</div>
    </div>
  );
}
