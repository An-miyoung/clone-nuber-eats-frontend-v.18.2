import React from "react";
import Button from "./button";

interface Options {
  name: string;
  extraPrice: number;
}

interface IDishProps {
  id: number;
  name: string;
  price: number;
  photo: string;
  description: string;
  isCustomer?: boolean;
  options?: any[] | null;
}

const Dish: React.FC<IDishProps> = ({
  id,
  name,
  price,
  photo,
  description,
  isCustomer = false,
  options,
}) => {
  return (
    <div className=" md:h-full pl-4 pr-1 pt-4 pb-3 border-2 border-gray-300 hover:border-gray-800 transition-all cursor-pointer">
      <h4 className=" text-lg font-medium mb-3">{name}</h4>
      <div className="pr-5 flex items-center justify-between">
        <div className="flex flex-col">
          <h6 className=" font-light break-words mb-5">{description}</h6>
          <h4 className=" font-medium">{price.toLocaleString("ko-KR")}원</h4>
        </div>
        <div>
          {photo !== null && (
            <div
              className="p-12 bg-lime-400 bg-center bg-cover"
              style={{
                backgroundImage: `url(${photo})`,
              }}
            ></div>
          )}
        </div>
      </div>
      {isCustomer && options?.length !== 0 ? (
        <div>
          <h5 className="my-3 font-light text-sm">* 추가할 수 있는 옵션</h5>
          {options?.map((option, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-gray-700 mb-1.5"
            >
              <h6>
                - {option.name} ({`${option.extraPrice.toLocaleString()}`}원)
              </h6>
              <span className="py-1 px-3 mr-5 cursor-pointer  text-lime-800 border-2 border-lime-300 rounded text-sm">
                옵션추가
              </span>
            </div>
          ))}
        </div>
      ) : (
        <h5 className="my-3 font-light text-sm">
          * 추가할 수 있는 옵션이 없습니다.
        </h5>
      )}
    </div>
  );
};

export default Dish;
