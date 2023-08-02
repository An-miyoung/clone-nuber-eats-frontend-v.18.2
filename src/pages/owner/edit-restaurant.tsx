import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../__generated__/graphql";
import { MY_RESTAURANT_QUERY } from "./owner-restaurant";

const EditRestaurant = () => {
  const { id } = useParams<{ id: string }>();
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
    <div>
      <div>EditRestaurant</div>
      <div>{data?.myRestaurant.restaurant?.name}</div>
      <div>{data?.myRestaurant.restaurant?.address}</div>
      <div>{data?.myRestaurant.restaurant?.category?.name}</div>
      <div>
        {data?.myRestaurant.restaurant?.menu.map((dish) => (
          <>
            <div>{dish.name}</div>
            <div>{dish.price}</div>
            <div>
              {dish.options?.map((option) => (
                <div>
                  {option.name}/ {option.extraPrice}
                </div>
              ))}
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default EditRestaurant;
