import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { gql } from "../__generated__/gql";
import { useQuery } from "@apollo/client";
import {
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderStatus,
  UserRole,
} from "../__generated__/graphql";
import { useMe } from "../hooks/useMe";

const GET_ORDER_QUERY = gql(/* GraphQL */ `
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        customer {
          email
        }
        driver {
          email
        }
        restaurant {
          name
        }
        totalPrice
        status
      }
    }
  }
`);

const ORDER_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      id
      customer {
        email
      }
      driver {
        email
      }
      restaurant {
        name
      }
      totalPrice
      status
    }
  }
`);

const changeStatusToKorean = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Cooked:
      return "배달배정을 기다립니다.";
    case OrderStatus.Cooking:
      return "조리중 혹은 포장중입니다.";
    case OrderStatus.Delivered:
      return "배달완료했습니다.";
    case OrderStatus.Pending:
      return "주방에 주문을 넣었습니다.";
    case OrderStatus.PickedUp:
      return "배달중입니다.";
    default:
      return "주문 대기중입니다.";
  }
};

const Order = () => {
  const params = useParams();
  const { data: userData } = useMe();

  const { data, subscribeToMore } = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >(GET_ORDER_QUERY, {
    variables: {
      input: {
        id: +params.id!,
      },
    },
  });

  // useQuery 에서 제공하는 subscribeToMore 를 사용하면 useSubscription 을 쓰지않아도 된다.
  // const { data: subscriptionData } = useSubscription<
  //   OrderUpdatesSubscription,
  //   OrderUpdatesSubscriptionVariables
  // >(ORDER_SUBSCRIPTION, {
  //   variables: {
  //     input: {
  //       id: +params.id!,
  //     },
  //   },
  // });

  console.log(data);

  useEffect(() => {
    if (data?.getOrder.ok && params.id) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (prev, { subscriptionData: { data } }) => {
          if (!data) return prev;
          // useQuery 를 통해 받는 data 는 {ok, error, order {id,...}} 인데,
          // useSubscription 을 통해 받는 data 는 {id,...} 이므로 data 의 모양을 맞춰준다.
          return {
            getOrder: {
              ...prev.getOrder,
              order: { ...data.orderUpdates },
            },
          };
        },
      });
    }
  }, [data, params.id, subscribeToMore]);

  return (
    <div className=" h-screen flex flex-col items-center mt-5 px-5 md:px-0 md:mt-10 lg:mt-28">
      <Helmet>
        <title> 주문 내역 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center justify-center border border-gray-800">
        <h4 className="w-full py-5 bg-gray-800 text-white text-center text-2xl md:text-3xl font-medium">
          주문 번호 #{`${params.id}`}
        </h4>
        <h5 className="p-4 pt-10 text-xl md:text-3xl text-center">
          {data?.getOrder.order?.totalPrice?.toLocaleString("ko-KR")}원
        </h5>
        <div className=" py-5 px-6  text-lg md:text-xl grid gap-6 text-gray-400">
          <div className=" border-t px-5  pt-6 md:px-32 border-gray-700 ">
            주문접수 식당 : {""}
            <span className="font-medium text-gray-900 ">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t px-5  pt-5 md:px-32 border-gray-700 ">
            주문고객 :{" "}
            <span className="font-medium text-gray-900">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t px-5 pt-5 md:px-32 border-gray-700  ">
            배달라이더 :{" "}
            <span className="font-medium text-gray-900">
              {data?.getOrder.order?.driver?.email || "미정"}
            </span>
          </div>
          {/* 주문자 render part */}
          {userData?.me.role === UserRole.Client && (
            <div className="border-t px-5 py-10 md:px-32 text-center border-gray-700 text-lime-600 ">
              현재,{" "}
              <span className="font-medium text-lime-600">
                {data?.getOrder.order?.status &&
                  changeStatusToKorean(data?.getOrder.order?.status)}
              </span>
            </div>
          )}
          {/* 점주 render part */}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button>주문접수</button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button>조리완료</button>
              )}
            </>
          )}

          {/* {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <>
              <span className=" text-center mt-2 text-xl text-lime-600">
                배달이 완료됐습니다.
              </span>
              <span className=" text-center  mb-5  text-xl text-lime-600">
                Nuber Eats를 이용해 주셔서 감사합니다.
              </span>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Order;
