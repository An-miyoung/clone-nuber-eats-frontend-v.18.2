import React from "react";
import { Link, useParams } from "react-router-dom";
import { gql } from "../../__generated__/gql";
import { useQuery } from "@apollo/client";
import {
  RestaurantQuery,
  RestaurantQueryVariables,
} from "../../__generated__/graphql";
import { Helmet } from "react-helmet-async";

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
        className=" py-12 md:py-40 bg-cover bg-center bg-lime-600"
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
    </div>
  );
};

export default Restaurant;
