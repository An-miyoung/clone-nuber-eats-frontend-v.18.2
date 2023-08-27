import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gql } from "../../__generated__/gql";
import {
  DeleteRestaurantMutation,
  DeleteRestaurantMutationVariables,
  EditRestaurantMutation,
  EditRestaurantMutationVariables,
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../__generated__/graphql";
import { MY_RESTAURANT_QUERY } from "./owner-restaurant";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import FormError from "../../components/form-error";
import Button from "../../components/button";

const DELETE_RESTAURANT_MUTATION = gql(/* GraphQL */ `
  mutation deleteRestaurant($input: DeleteRestaurantInput!) {
    deleteRestaurant(input: $input) {
      ok
      error
    }
  }
`);

const EDIT_RESTAURANT_MUTATION = gql(/* GraphQL */ `
  mutation editRestaurant($input: EditRestaurantInput!) {
    editRestaurant(input: $input) {
      ok
      error
    }
  }
`);

const EditRestaurant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

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

  const [editRestaurantMutation, { data: editRestaurantResult }] = useMutation<
    EditRestaurantMutation,
    EditRestaurantMutationVariables
  >(EDIT_RESTAURANT_MUTATION, {
    onCompleted: (data: EditRestaurantMutation) => {
      const {
        editRestaurant: { ok },
      } = data;
      if (ok) {
        setUploading(false);
        navigate(`/restaurant/${id}`);
      }
    },
  });

  const [deleteRestaurantMutation, { data: deleteRstaurantResult }] =
    useMutation<DeleteRestaurantMutation, DeleteRestaurantMutationVariables>(
      DELETE_RESTAURANT_MUTATION,
      {
        onCompleted: (data: DeleteRestaurantMutation) => {
          const {
            deleteRestaurant: { ok },
          } = data;
          if (ok) {
            setUploading(false);
            navigate("/");
          }
        },
      }
    );

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

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, categoryName, address, file } = getValues();
      console.log(file);
      if (!file) {
        const coverImg = data?.myRestaurant.restaurant?.coverImg;
        editRestaurantMutation({
          variables: {
            input: {
              restaurantId: +id!,
              name,
              categoryName,
              address,
              coverImg,
            },
          },
        });
      } else if (file) {
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
        console.log("새파일:", coverImg);
        editRestaurantMutation({
          variables: {
            input: {
              restaurantId: +id!,
              name,
              categoryName,
              address,
              coverImg,
            },
          },
        });
      }

      setUploading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    window.alert("확인을 누르면 영구삭제됩니다.");
    setUploading(true);
    // 아이디를 들고 와서 backend에서 delete 하고 aws 에서 사진지우는 작업
    deleteRestaurantMutation({
      variables: {
        input: {
          restaurantId: +id!,
        },
      },
    });
  };

  return (
    <div className=" h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>음식점 정보수정 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <h4 className="w-full text-left text-2xl md:text-3xl font-medium pl-2">
          가게 상세정보
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col mt-5 mb-3"
        >
          <div>
            <label htmlFor="name" className="text-sm text-gray-600 px-3 ">
              * 상호 :
            </label>
            <input
              {...register("name", {
                required: "필수항목입니다.",
                minLength: 1,
                maxLength: 30,
              })}
              aria-invalid={errors.name ? true : false}
              name="name"
              id="name"
              type="text"
              placeholder="음식점 이름"
              className="input"
              required
            />
          </div>
          {errors.name?.type === "minLength" && (
            <FormError errorMessage="1글자이상 입력하세요" />
          )}
          {errors.name?.type === "maxLength" && (
            <FormError errorMessage="30글자이하로 입력하세요" />
          )}
          <div>
            <h4 className="text-sm text-gray-600 pl-3 mt-4">
              * 음식점의 대표이미지 파일을 선택해주세요.
            </h4>
            <input
              {...register("file")}
              accept="image/*"
              name="file"
              type="file"
              className="input mb-3"
            />
          </div>
          <div>
            <label htmlFor="address" className="text-sm text-gray-600 px-3 ">
              * 주소 :
            </label>
            <input
              {...register("address")}
              name="address"
              id="address"
              type="text"
              placeholder="음식점의 주소"
              className="input my-3"
            />
          </div>
          <div>
            <label
              htmlFor="categoryName"
              className="text-sm text-gray-600 px-3"
            >
              * 카테고리 :
            </label>
            <input
              {...register("categoryName")}
              name="categoryName"
              id="categoryName"
              type="text"
              placeholder="음식점의 카테고리"
              className="input my-3"
            />
          </div>
          <Button
            canClick={isValid}
            loading={uploading}
            actionText="수정하기"
          />
          {editRestaurantResult?.editRestaurant.error && (
            <FormError
              errorMessage={editRestaurantResult.editRestaurant.error}
            />
          )}
          <div
            onClick={handleDelete}
            className=" mt-5 text-red-600 text-center cursor-pointer"
          >
            삭제하기
          </div>
          {deleteRstaurantResult?.deleteRestaurant.error && (
            <FormError
              errorMessage={deleteRstaurantResult.deleteRestaurant.error}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default EditRestaurant;
