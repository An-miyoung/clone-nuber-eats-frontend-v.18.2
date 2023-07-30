import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { gql } from "../../__generated__/gql";
import { useQuery } from "@apollo/client";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../__generated__/graphql";

export const MY_RESTAURANT_QUERY = gql(/* GraphQL */ `
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
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

const MyRestaurant = () => {
  const { id } = useParams();
  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id!,
        },
      },
    }
  );
  console.log(data);

  return (
    <>
      <Helmet>
        <title>
          {data?.myRestaurant.restaurant?.name || "로딩중..."} 상세정보 | Nuber
          Eats
        </title>
      </Helmet>
      <div>
        <div
          className=" bg-gray-700 py-10 md:py-20 bg-center bg-cover"
          style={{
            backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
          }}
        >
          <div className="w-2/4 py-2 pl-5 md:w-2/6 md:py-4 md:pl-28 bg-white ">
            <span className="text-xl md:text-3xl">
              {data?.myRestaurant.restaurant?.name}{" "}
              <span className="text-sm md:text-lg">상세정보</span>
            </span>
          </div>
        </div>
        <div className="w-full px-3 md:px-5 xl:px-1 max-w-screen-xl mx-auto mt-5">
          <div className="flex justify-between md:justify-start">
            <Link
              to={``}
              className=" mr-1 md:mr-8 text-white bg-gray-800 py-3 px-2 md:py-3 md:px-10"
            >
              메뉴 만들기
            </Link>
            <span className="mr-1 md:mr-8 cursor-pointer text-white bg-lime-700 py-2 px-3 md:py-3 md:px-10">
              프로모션 구매
            </span>
            <Link
              to={`/edit-restaurant/${id}`}
              className=" mr-1 md:mr-8 text-gray-800 bg-gray-300 py-3 px-2 md:py-3 md:px-10"
            >
              상세정보 수정
            </Link>
          </div>
          <div className="mt-8 flex justify-center md:justify-start">
            {data?.myRestaurant.restaurant?.menu.length === 0 ? (
              <span>메뉴가 없습니다. 메뉴를 추가해 주세요.</span>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRestaurant;
