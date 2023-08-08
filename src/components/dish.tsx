import React from "react";

interface IDishProps {
  id: number;
  name: string;
  price: number;
  photo: string;
  description: string;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  options?: any[] | null;
  children?: any;
}

const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  price,
  photo,
  description,
  isCustomer = false,
  orderStarted = false,
  isSelected = false,
  options,
  children: dishOptions,
}) => {
  return (
    <div className=" md:h-full pl-4 pr-1 pt-4 pb-3 order-2 transition-all cursor-pointer border-gray-300 ">
      <div className="flex justify-between items-baseline pr-5">
        <h4 className=" text-lg font-medium mb-3">{name}</h4>
      </div>
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
      {orderStarted && (
        <>
          {isCustomer && options?.length !== 0 ? (
            <>{isSelected && <div>{dishOptions}</div>}</>
          ) : (
            <h5 className="my-3 font-light text-sm">
              * 추가할 수 있는 옵션이 없습니다.
            </h5>
          )}
        </>
      )}
    </div>
  );
};

export default Dish;
