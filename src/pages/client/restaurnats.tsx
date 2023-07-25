import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { gql } from "../../__generated__/gql";
import { useQuery } from "@apollo/client";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../__generated__/graphql";
import Category from "../../components/category";
import Restaurant from "../../components/restaurant";

const RESTAURANTS_QUERY = gql(/* GraphQL */ `
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`);

const Restaurnats = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
        itemsPerOnePage: 9,
      },
    },
  });

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => prev - 1);

  return (
    <>
      <Helmet>
        <title>주문가능한 식당들 | Nuber Eats</title>
      </Helmet>
      <div>
        <form className=" w-full bg-black py-40 flex items-center justify-center">
          <input
            type="Search"
            placeholder="검색..."
            className="input h-9 w-3/12 border-0 rounded"
          />
        </form>
        {!loading && data && (
          <div className="w-full px-5 xl:px-1 max-w-screen-xl mx-auto mt-5">
            <div className=" max-w-md mx-auto flex justify-around items-center">
              {data?.allCategories.categories?.map((category) => (
                <Category
                  key={category.id}
                  id={`${category.id}`}
                  name={category.name}
                  coverImg={category.coverImg!}
                />
              ))}
            </div>
            <div className=" grid md:grid-cols-3 gap-x-4 gap-y-7 mt-10">
              {data.restaurants.restaurants?.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  id={`${restaurant.id}`}
                  name={restaurant.name}
                  coverImg={restaurant.coverImg}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
            {data.restaurants.totalPages && (
              // 가운데 글씨가 픽스되고 양쪽으로 화살표가 만들어지는 상황을 만들기 위해 grid 사용하고 빈 div
              <div className="grid grid-cols-3 text-center max-w-md mx-auto mt-10 mb-16">
                {page > 1 ? (
                  <button
                    onClick={prevPage}
                    className="font-medium text-2xl focus:outline-none"
                  >
                    &larr;
                  </button>
                ) : (
                  <div></div>
                )}
                <span className="mx-5">
                  {page} of {data.restaurants.totalPages}
                </span>
                {page < data.restaurants.totalPages ? (
                  <button
                    onClick={nextPage}
                    className="font-medium text-2xl focus:outline-none"
                  >
                    &rarr;
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Restaurnats;
