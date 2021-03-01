interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  addOptionToItem: (dishId: number, optionName: any) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
  dishId: number;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  addOptionToItem,
  dishId,
  removeOptionFromItem,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
    addOptionToItem(dishId, name);
  };
  return (
    <span
      onClick={onClick}
      className={`border px-2 py-1 ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <span className="mr-2">{name}</span>
      {<span className="text-sm opacity-75">(${extra})</span>}
    </span>
  );
};