import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { gql } from "../../__generated__/gql";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import FormError from "../../components/form-error";
import Button from "../../components/button";

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
  coverImg: string;
  address: string;
  categoryName: string;
}

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ICreateRestaurantForm>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<ICreateRestaurantForm> = (data) => {
    console.log(data);
    const { name, coverImg, address, categoryName } = data;
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
  };

  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      navigate(`/restaurant/${restaurantId}`);
    }
  };

  const [createRestaurantMutation, { data: cresteRestaurantResult, loading }] =
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

          <input
            {...register("coverImg", {
              required: "필수항목입니다.",
            })}
            name="coverImg"
            type="text"
            placeholder="음식점의 대표이미지"
            className="input my-3"
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
            loading={loading}
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
