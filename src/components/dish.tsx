import React, { useState } from "react";

interface IDishProps {
  id: number;
  name: string;
  price: number;
  photo: string;
  description: string;
  isCustomer?: boolean;
  orderStarted?: boolean;
  // isSelected?: boolean;
  options?: any[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeItemToOrder?: (dishId: number) => void;
  addOptionToItem?: (dishId: number, optioms: any) => void;
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
  // isSelected = false,
  options,
  // addItemToOrder,
  // removeItemToOrder,
  // addOptionToItem,
  children: dishOptions,
}) => {
  // const [showOption, setShowOption] = useState(false);
  // const onClick = () => {
  //   if (orderStarted) {
  //     if (!isSelected && addItemToOrder) {
  //       setShowOption(true);
  //       return addItemToOrder(id);
  //     }
  //     if (isSelected && removeItemToOrder) {
  //       setShowOption(false);
  //       return removeItemToOrder(id);
  //     }
  //   }
  // };

  return (
    <div className=" md:h-full pl-4 pr-1 pt-4 pb-3 order-2 transition-all cursor-pointer border-gray-300 ">
      <div className="flex justify-between items-baseline pr-5">
        <h4 className=" text-lg font-medium mb-3">{name}</h4>
        {/* {orderStarted && (
        <button
          onClick={onClick}
          className="py-1 px-3 text-lime-800 bg-lime-300 rounded"
        >
          주문하기
        </button>
      )} */}
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
            <div>
              {/* {showOption &&
              options?.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-gray-700"
                >
                  <h6 className="mt-2">
                    - {option.name} (
                    {`${option.extraPrice.toLocaleString()}`}
                    원)
                  </h6>
                  <div className="  flex items-center mt-2">
                    <button
                      onClick={() => onOptionClick(option)}
                      className="py-1 px-3 mr-5 cursor-pointer  text-lime-800 "
                    >
                      + 추가
                    </button>
                    <button
                      onClick={() => onOptionClick(option)}
                      className="py-1 px-3 mr-5 cursor-pointer  text-red-800"
                    >
                      - 삭제
                    </button>
                  </div>
                </div>
              ))} */}
              {dishOptions}
            </div>
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
