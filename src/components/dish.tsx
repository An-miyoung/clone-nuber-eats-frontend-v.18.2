import React from "react";
import Button from "./button";

interface IDishProps {
  id: number;
  name: string;
  price: number;
  photo: string;
  description: string;
}

const Dish: React.FC<IDishProps> = ({
  id,
  name,
  price,
  photo,
  description,
}) => {
  return (
    <div className="pl-4 pr-1 pt-4 pb-3 border-2 border-gray-300 hover:border-gray-800 transition-all cursor-pointer">
      <div className="px-5 flex justify-between items-center mb-2">
        <h4 className=" text-lg font-medium mb-3">{name}</h4>
        <div className=" text-lime-700 bg-lime-300 py-2 px-3 cursor-pointer">
          메뉴수정
        </div>
      </div>
      <div className="pr-5 flex items-center justify-between">
        <div className="flex flex-col">
          <h6 className=" font-light break-words mb-5">{description}</h6>
          <h4 className=" font-medium">{price.toLocaleString("ko-KR")}원</h4>
        </div>
        <div>
          {photo !== null && (
            <div
              className="p-12 bg-center bg-cover"
              style={{
                backgroundImage: `url(${photo})`,
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dish;
