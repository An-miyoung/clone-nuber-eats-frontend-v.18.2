import React from "react";

interface IDishOptionProps {
  dishId: number;
  name: string;
  extraPrice?: number | null;
  isSelected: boolean;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

const DishOption: React.FC<IDishOptionProps> = ({
  dishId,
  name,
  extraPrice,
  isSelected,
  addOptionToItem,
  removeOptionFromItem,
}) => {
  const onClick = (dishId: number, name: string) => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };
  return (
    <div className="flex items-center justify-between text-gray-700">
      <h6 className={`mt-2 ${isSelected ? ` text-lime-800` : null} `}>
        {isSelected ? "v" : "-"} {name}{" "}
        {extraPrice && `(${extraPrice.toLocaleString()}원)`}
      </h6>
      <div className="  flex items-center mt-2">
        <span
          onClick={() => onClick(dishId, name)}
          className="py-1 px-3 mr-5 cursor-pointer "
        >
          {isSelected ? (
            <span className="text-red-800">- 삭제</span>
          ) : (
            <span className=" text-lime-800 ">+ 추가</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default DishOption;
