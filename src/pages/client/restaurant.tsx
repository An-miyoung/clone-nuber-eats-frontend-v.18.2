import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { gql } from "../../__generated__/gql";
import { useQuery } from "@apollo/client";
import {
  CreateOrderItemInput,
  RestaurantQuery,
  RestaurantQueryVariables,
} from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import Dish from "../../components/dish";

const RESTAURANT_QUERY = gql(/* GraphQL */ `
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        id
        name
        coverImg
        category {
          name
          slug
        }
        address
        isPromoted
        menu {
          id
          name
          price
          photo
          description
          options {
            name
            extraPrice
            choices {
              name
              extraPrice
            }
          }
        }
      }
    }
  }
`);

const CREATE_ORDER_MUTATION = gql(/* GraphQL */ `
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`);

const Restaurant = () => {
  const params = useParams();
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const [showOption, setShowOption] = useState(false);

  const { loading, data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +params.id!,
        },
      },
    }
  );

  const triggerStartOrder = () => {
    setOrderStarted(true);
  };

  const getItems = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const isSelected = (dishId: number) => {
    return Boolean(orderItems.find((order) => order.dishId === dishId));
  };

  const onClick = (dishId: number) => {
    console.log(isSelected);
    if (orderStarted) {
      if (!isSelected(dishId)) {
        console.log(isSelected);
        setShowOption(true);
        return addItemToOrder(dishId);
      }
      if (isSelected(dishId) && removeItemToOrder) {
        setShowOption(false);
        return removeItemToOrder(dishId);
      }
    }
  };
  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) return;
    setOrderItems((prev) => [...prev, { dishId, options: [] }]);
  };
  const removeItemToOrder = (dishId: number) => {
    setOrderItems((prev) => prev.filter((order) => order.dishId !== dishId));
  };
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) return;
    const oldItem = getItems(dishId);
    if (oldItem) {
      // 똑같은 옵션을 중복하지 않도록 체크
      const hasOptions = Boolean(
        oldItem.options?.find((aOption) => aOption.name === optionName)
      );
      if (!hasOptions) {
        removeItemToOrder(dishId);
        setOrderItems((prev) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...prev,
        ]);
      }
    }
  };
  console.log(orderItems);

  return (
    <div>
      <Helmet>
        <title>{`${data?.restaurant.restaurant?.name}`} | Nuber Eats</title>
      </Helmet>
      <div
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
        className="  bg-lime-400 py-10 md:py-20 bg-cover bg-center"
      >
        <div className=" w-2/4 py-3 pl-5 md:w-2/6 md:py-8 md:pl-28 bg-white ">
          <h4 className=" text-lg md:text-3xl mb-1 md:mb-4">
            {data?.restaurant.restaurant?.name}
          </h4>
          <Link to={`/category/${data?.restaurant.restaurant?.category?.slug}`}>
            <h5 className="text-xs md:text-sm font-light mb-1 md:mb-2">
              {data?.restaurant.restaurant?.category?.name}
            </h5>
          </Link>
          <h6 className="text-xs md:text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="flex flex-col px-3 mb-20 md:px-5 xl:px-1 max-w-screen-xl mx-auto mt-7 md:mt-10 md:items-end">
        <button
          onClick={triggerStartOrder}
          className="btn px-3 lg:px-10 bg-lime-900 mb-5"
        >
          {orderStarted ? "주문 진행중..." : "클릭하면 주문시작!"}
        </button>
        <div className="w-full grid lg:grid-cols-3 gap-x-4 gap-y-7">
          {data?.restaurant.restaurant?.menu.map((dish) => (
            <div key={dish.id} className="relative">
              {orderStarted && (
                <div
                  onClick={() => onClick(dish.id)}
                  className="absolute right-6 top-3.5 py-1 px-3 cursor-pointer  text-lime-800 bg-lime-300 rounded"
                >
                  주문해볼까?
                </div>
              )}
              <Dish
                id={dish.id}
                name={dish.name}
                price={dish.price}
                photo={dish.photo}
                description={dish.description}
                isCustomer={true}
                orderStarted={orderStarted}
                options={dish.options}
                // addItemToOrder={addItemToOrder}
                // removeItemToOrder={removeItemToOrder}
                // addOptionToItem={addOptionToItem}
              >
                {showOption &&
                  dish.options?.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-gray-700"
                    >
                      <h6 className="mt-2">
                        - {option.name} (
                        {`${option.extraPrice!.toLocaleString()}`}
                        원)
                      </h6>
                      <div className="  flex items-center mt-2">
                        <button
                          onClick={() => addOptionToItem(dish.id, option.name)}
                          className="py-1 px-3 mr-5 cursor-pointer  text-lime-800 "
                        >
                          + 추가
                        </button>
                        <button
                          onClick={() => addOptionToItem(dish.id, option.name)}
                          className="py-1 px-3 mr-5 cursor-pointer  text-red-800"
                        >
                          - 삭제
                        </button>
                      </div>
                    </div>
                  ))}
              </Dish>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
