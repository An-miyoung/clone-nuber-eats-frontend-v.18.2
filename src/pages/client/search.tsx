import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { gql } from "../../__generated__/gql";
import { useLazyQuery } from "@apollo/client";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../__generated__/graphql";
import SearchForm from "../../components/search-form";
import Restaurant from "../../components/restaurant";

const SEARCH_RESTAURANT_QUERY = gql(/* GraphQL */ `
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
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
          slug
        }
        address
        isPromoted
      }
    }
  }
`);

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // 검색어가 있는 경우에만 query 를 해오도록 lazyQuery 사용.
  // useMutation 과 비슷하게 튜플을 반환하고 query 함수를 준다. 필요할때 부르면 그때 query 한다.
  const [fetchNow, { loading, data }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT_QUERY);

  useEffect(() => {
    const query = searchParams.get("term");
    if (!query) {
      return navigate("/");
    }
    fetchNow({
      variables: {
        input: {
          itemsPerOnePage: 9,
          page,
          query,
        },
      },
    });
    setQuery(query);
  }, [fetchNow, navigate, page, searchParams]);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => prev - 1);

  return (
    <div>
      <Helmet>
        <title>{query} 검색... | Nuber Eats</title>
      </Helmet>
      <SearchForm />
      {!loading &&
      data &&
      data.searchRestaurant.totalResults &&
      data.searchRestaurant.totalResults > 0 ? (
        <div className="w-full px-5 xl:px-1 max-w-screen-xl mx-auto mt-5 md:mt-10">
          <div className=" md:h-20 flex flex-col md:flex-row md:justify-around md:items-center">
            <span className="text-xl md:text-3xl">
              " {query} " 검색 결과 ...
            </span>
            <span className=" md:text-lg mt-3">
              총 레스토랑 수 : {data.searchRestaurant.totalResults} 곳
            </span>
          </div>
          <div className=" grid md:grid-cols-3 gap-x-4 gap-y-7 mt-10">
            {data.searchRestaurant.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={`${restaurant.id}`}
                name={restaurant.name}
                coverImg={restaurant.coverImg}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          {data.searchRestaurant.totalPages && (
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
                {page} of {data.searchRestaurant.totalPages}
              </span>
              {page < data.searchRestaurant.totalPages ? (
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
      ) : (
        <div className="flex justify-around mt-10">
          <span className="text-xl md:text-3xl break-words">
            " {query} " 검색 결과가 없습니다.
          </span>
        </div>
      )}
    </div>
  );
};

export default Search;
