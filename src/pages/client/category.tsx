import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { gql } from "../../__generated__/gql";
import {
  CategoryQuery,
  CategoryQueryVariables,
} from "../../__generated__/graphql";
import SearchForm from "../../components/search-form";
import Restaurant from "../../components/restaurant";

const CATEGORY_QUERY = gql(/* GraphQL */ `
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        id
        name
        coverImg
        address
        isPromoted
      }
      category {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
  }
`);

const CategoryPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          itemsPerOnePage: 6,
          slug: slug || "",
        },
      },
    }
  );

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => prev - 1);

  return (
    <div>
      <Helmet>
        <title>{`${slug}`} | Nuber Eats</title>
      </Helmet>
      <SearchForm />
      {!loading &&
      data &&
      data.category.totalResults &&
      data.category.totalResults > 0 ? (
        <div className="w-full px-5 xl:px-1 max-w-screen-xl mx-auto mt-5 md:mt-10">
          <div className=" md:h-20 flex flex-col md:flex-row md:justify-around md:items-center">
            <span className=" text-xl md:text-3xl">
              " {slug} " 카테고리 검색 결과 ...
            </span>
            <span className=" md:text-lg mt-3">
              총 레스토랑 수 : {data.category.totalResults} 곳
            </span>
          </div>
          <div className=" grid md:grid-cols-3 gap-x-4 gap-y-7 mt-10">
            {data.category.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={`${restaurant.id}`}
                name={restaurant.name}
                coverImg={restaurant.coverImg}
                categoryName={data.category.category?.name}
              />
            ))}
          </div>
          {data.category.totalPages && (
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
                {page} of {data.category.totalPages}
              </span>
              {page < data.category.totalPages ? (
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
            " {slug} " 카테고리 검색 결과가 없습니다.
          </span>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
