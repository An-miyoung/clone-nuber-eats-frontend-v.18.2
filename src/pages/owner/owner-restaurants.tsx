import React, { useEffect } from "react";
import { gql } from "../../__generated__/gql";
import { useQuery, useSubscription } from "@apollo/client";
import {
  MyRestaurantsQuery,
  PendingOrdersSubscription,
} from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";
import Restaurant from "../../components/restaurant";
import { Link, useNavigate } from "react-router-dom";
import { PENDING_ORDERS_SUBSCRIPTION } from "./owner-restaurant";

export const MY_RESTAURANTS_QUERY = gql(/* GraphQL */ `
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        id
        name
        coverImg
        category {
          name
          slug
        }
        address
        isPromoted
      }
    }
  }
`);

const MyRestaurants = () => {
  const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);
  const navigate = useNavigate();
  const { data: subscriptionData } = useSubscription<PendingOrdersSubscription>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      navigate(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [navigate, subscriptionData]);
  return (
    <>
      <Helmet>
        <title>음식점 사장님 계정 | Nuber Eats</title>
      </Helmet>
      {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants?.length === 0 && (
          <>
            <div className=" py-12 md:py-40 bg-cover bg-center bg-lime-600">
              <div className=" md:h-20 flex justify-around items-center">
                <span className="text-xl md:text-3xl">나의 계정 상세정보</span>
              </div>
            </div>
            <div className=" flex flex-col justify-center items-center mt-10">
              <span className="text-xl md:text-3xl break-words mb-2">
                음식점이 없습니다.
              </span>
              <Link to="/add-restaurant">
                <span className=" text-lime-600 underline hover:underline">
                  새로운 음식점 만들기
                </span>
              </Link>
            </div>
          </>
        )}
      <div className="w-full px-5 xl:px-1 max-w-screen-xl mx-auto m-5 md:mb-10">
        <div className="flex flex-col md:relative md:h-20 justify-around items-center">
          <h4 className=" text-xl md:text-3xl">나의 계정 상세정보</h4>
          <button className=" p-1 md:px-2 mt-2 bg-lime-600 text-white md:absolute md:top-3 md:right-0">
            <Link to="/add-restaurant">새로운 음식점 만들기</Link>
          </button>
        </div>
        <div className=" grid md:grid-cols-3 gap-x-4 gap-y-7 mt-10">
          {data?.myRestaurants.restaurants?.map((restaurant) => (
            <Restaurant
              key={restaurant.id}
              id={`${restaurant.id}`}
              name={restaurant.name}
              coverImg={restaurant.coverImg}
              categoryName={restaurant.category?.name}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyRestaurants;
