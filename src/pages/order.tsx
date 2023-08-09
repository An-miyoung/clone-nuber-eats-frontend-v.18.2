import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { gql } from "../__generated__/gql";
import { useQuery } from "@apollo/client";
import {
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderStatus,
} from "../__generated__/graphql";

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

const Order = () => {
  const params = useParams();

  const { data } = useQuery<GetOrderQuery, GetOrderQueryVariables>(
    GET_ORDER_QUERY,
    {
      variables: {
        input: {
          id: +params.id!,
        },
      },
    }
  );
  console.log(data);

  return (
    <div className=" h-screen flex flex-col items-center mt-5 px-5 md:px-0 md:mt-10 lg:mt-28">
      <Helmet>
        <title> 주문 내역 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center justify-center border border-gray-800">
        <h4 className="w-full py-5 bg-gray-800 text-white text-center text-3xl font-medium">
          주문 번호 #{`${params.id}`}
        </h4>
        <h5 className="p-4 pt-10 text-3xl text-center">
          {data?.getOrder.order?.totalPrice?.toLocaleString("ko-KR")}원
        </h5>
        <div className=" py-5 px-6  text-xl grid gap-6 text-gray-400">
          <div className=" border-t pl-5  pt-6 md:px-32 border-gray-700 ">
            주문접수 식당 : {""}
            <span className="font-medium text-gray-900 ">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pl-5  pt-5 md:px-32 border-gray-700 ">
            주문고객 :{" "}
            <span className="font-medium text-gray-900">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t pl-5 pt-5 md:px-32 border-gray-700  ">
            배달라이더 :{" "}
            <span className="font-medium text-gray-900">
              {data?.getOrder.order?.driver?.email || "미정"}
            </span>
          </div>
          <div className="border-t border-b pl-5 py-5 md:px-32 border-gray-700  ">
            진행상황 :{" "}
            <span className="font-medium text-lime-900">
              {data?.getOrder.order?.status}
            </span>
          </div>

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
