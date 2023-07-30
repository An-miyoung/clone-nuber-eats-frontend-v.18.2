import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useApolloClient, useMutation } from "@apollo/client";
import { gql } from "../../__generated__/gql";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import FormError from "../../components/form-error";
import Button from "../../components/button";
import { MY_RESTAURANTS_QUERY } from "./owner-restaurants";

const CREATE_RESTAURANT_MUTATION = gql(/* GraphQL */ `
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`);

interface ICreateRestaurantForm {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

const CreateRestaurant = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [coverImgUrl, setCoverImgUrl] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<ICreateRestaurantForm>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<ICreateRestaurantForm> = async (data) => {
    try {
      setUploading(true);
      const { name, file, address, categoryName } = data;
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      // graphQl mutation을 통해 file을 처리하지 못한다. url 이 서로 다름.그래서 API post
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setCoverImgUrl(coverImg);
      createRestaurantMutation({
        variables: {
          input: {
            name,
            coverImg,
            address,
            categoryName,
          },
        },
      });
      setUploading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, error, restaurantId },
    } = data;
    if (ok && data) {
      setUploading(false);
      const { name, address, categoryName } = getValues();
      // Link to 로 이동하면 cache 내용을 읽어올 수 있지만, url 을 손으로 쳐서 가면 null
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      console.log(queryResult);
      if (queryResult !== null && queryResult !== undefined) {
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          data: {
            myRestaurants: {
              ...queryResult?.myRestaurants,
              ok,
              error,
              restaurants: [
                ...queryResult?.myRestaurants.restaurants!,
                {
                  __typename: "Restaurant",
                  id: restaurantId,
                  name,
                  coverImg: coverImgUrl,
                  address,
                  isPromoted: false,
                  category: {
                    __typename: "Category",
                    name: categoryName,
                    slug: categoryName.replace(/ /g, "-"),
                  },
                },
              ],
            },
          },
        });
      }
      navigate(`/restaurant/${restaurantId}`);
    }
  };

  const [createRestaurantMutation, { data: cresteRestaurantResult }] =
    useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(
      CREATE_RESTAURANT_MUTATION,
      {
        onCompleted,
      }
    );

  return (
    <div className=" h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>신규 음식점 만들기 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <h4 className="w-full text-left text-2xl md:text-3xl font-medium pl-2">
          새로운 음식점 계정을 만듭니다.
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col mt-5 mb-3"
        >
          <input
            {...register("name", {
              required: "필수항목입니다.",
              minLength: 1,
              maxLength: 15,
            })}
            aria-invalid={errors.name ? true : false}
            name="name"
            type="text"
            placeholder="음식점 이름"
            className="input"
            required
          />
          {errors.name?.type === "minLength" && (
            <FormError errorMessage="1글자이상 입력하세요" />
          )}
          {errors.name?.type === "maxLength" && (
            <FormError errorMessage="20글자이하로 입력하세요" />
          )}
          <h4 className="text-sm text-gray-400 pl-3 mt-4">
            * 음식점의 대표이미지 파일을 선택해주세요.
          </h4>
          <input
            {...register("file", {
              required: "필수항목입니다.",
            })}
            accept="image/*"
            name="file"
            type="file"
            className="input mb-3"
            required
          />
          <input
            {...register("address", {
              required: "필수항목입니다.",
            })}
            name="address"
            type="text"
            placeholder="음식점의 주소"
            className="input my-3"
            required
          />
          <input
            {...register("categoryName", {
              required: "필수항목입니다.",
            })}
            name="categoryName"
            type="text"
            placeholder="음식점의 카테고리"
            className="input my-3"
            required
          />
          <Button
            canClick={isValid}
            loading={uploading}
            actionText="음식점 만들기"
          />
          {cresteRestaurantResult?.createRestaurant.error && (
            <FormError
              errorMessage={cresteRestaurantResult.createRestaurant.error}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurant;
