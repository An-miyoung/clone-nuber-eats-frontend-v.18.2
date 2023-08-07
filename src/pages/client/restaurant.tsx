import React from "react";
import { Link, useParams } from "react-router-dom";
import { gql } from "../../__generated__/gql";
import { useQuery } from "@apollo/client";
import {
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

const Restaurant = () => {
  const params = useParams();

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
      <div className="w-full px-3 md:px-5 xl:px-1 max-w-screen-xl mx-auto mt-7 md:mt-10">
        <div className=" grid md:grid-cols-3 gap-x-4 gap-y-7">
          {data?.restaurant.restaurant?.menu.map((dish) => (
            <div key={dish.id} className="relative">
              <div className="absolute right-6 top-3.5 py-1 px-3 cursor-pointer  text-lime-800 bg-lime-300 rounded">
                구매하기
              </div>
              <Dish
                id={dish.id}
                name={dish.name}
                price={dish.price}
                photo={dish.photo}
                description={dish.description}
                isCustomer={true}
                options={dish.options}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
