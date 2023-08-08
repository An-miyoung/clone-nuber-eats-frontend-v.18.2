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
import DishOption from "../../components/dish-option";

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
  // react 에서 state 가 변하면 re-render 해주는 점을 이용하기 위해 초기세팅을 만든다.
  // 이렇게 만들지 않고 addOptionToItem 내부에서 만들면서 옵션을 추가하면 한번씩 렌더가 밀린다.
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
        // 맨처음 만든 [dishId, option:[]] 를 삭제하기 위해서 removeItemToOrder
        removeItemToOrder(dishId);
        setOrderItems((prev) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...prev,
        ]);
      }
    }
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItems(dishId);
    if (item) {
      return Boolean(
        item?.options?.find((option) => option.name === optionName)
      );
    }
    return false;
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) return;
    const oldItem = getItems(dishId);
    if (oldItem) {
      removeItemToOrder(dishId);
      setOrderItems((prev) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
        ...prev,
      ]);
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
                isSelected={isSelected(dish.id)}
                orderStarted={orderStarted}
                options={dish.options}
              >
                {showOption &&
                  dish.options?.map((option, idx) => (
                    <DishOption
                      key={idx}
                      dishId={dish.id}
                      name={option.name}
                      extraPrice={option.extraPrice}
                      isSelected={isOptionSelected(dish.id, option.name)}
                      addOptionToItem={addOptionToItem}
                      removeOptionFromItem={removeOptionFromItem}
                    />
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
