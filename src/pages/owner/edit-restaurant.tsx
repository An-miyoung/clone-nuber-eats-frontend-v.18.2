import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../__generated__/graphql";
import { MY_RESTAURANT_QUERY } from "./owner-restaurant";
import { Helmet } from "react-helmet-async";
import { SubmitHandler, useForm } from "react-hook-form";
import FormError from "../../components/form-error";
import Button from "../../components/button";

interface IEditRestaurantForm {
  name: string;
  address?: string;
  categoryName?: string;
  file?: FileList;
}

const EditRestaurant = () => {
  const { id } = useParams<{ id: string }>();
  const [uploading, setUploading] = useState(false);
  const { data, loading } = useQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +id!,
      },
    },
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      name: data?.myRestaurant.restaurant?.name,
      address: data?.myRestaurant.restaurant?.address,
      categoryName: data?.myRestaurant.restaurant?.category?.name,
      file: null,
    },
    mode: "onChange",
  });

  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className=" h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>음식점 정보수정 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <h4 className="w-full text-left text-2xl md:text-3xl font-medium pl-2">
          음식점 상세정보를 수정합니다.
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col mt-5 mb-3"
        >
          <input
            {...register("name", {
              required: "필수항목입니다.",
              minLength: 1,
              maxLength: 30,
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
            <FormError errorMessage="30글자이하로 입력하세요" />
          )}
          <h4 className="text-sm text-gray-400 pl-3 mt-4">
            * 음식점의 대표이미지 파일을 선택해주세요.
          </h4>
          <input
            {...register("file")}
            accept="image/*"
            name="file"
            type="file"
            className="input mb-3"
          />
          <input
            {...register("address")}
            name="address"
            type="text"
            placeholder="음식점의 주소"
            className="input my-3"
          />
          <input
            {...register("categoryName")}
            name="categoryName"
            type="text"
            placeholder="음식점의 카테고리"
            className="input my-3"
          />
          {/* <button>수정하기</button> */}
          <Button canClick={isValid} loading={loading} actionText="수정하기" />
          {/* {cresteRestaurantResult?.createRestaurant.error && (
            <FormError
              errorMessage={cresteRestaurantResult.createRestaurant.error}
            />
          )} */}
        </form>
      </div>
    </div>
  );
};

export default EditRestaurant;
