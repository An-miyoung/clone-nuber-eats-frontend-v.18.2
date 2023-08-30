import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { gql } from "../../__generated__/gql";
import { useMutation, useQuery } from "@apollo/client";
import {
  DeleteDishMutation,
  DeleteDishMutationVariables,
  EditDishMutation,
  EditDishMutationVariables,
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../__generated__/graphql";
import { MY_RESTAURANT_QUERY } from "./owner-restaurant";
import FormError from "../../components/form-error";
import Button from "../../components/button";

const EDIT_DISH_MUTATION = gql(/* GraphQL */ `
  mutation editDish($input: EditDishInput!) {
    editDish(input: $input) {
      ok
      error
    }
  }
`);

const DELETE_DISH_MUTATION = gql(/* GraphQL */ `
  mutation deleteDish($input: DeleteDishInput!) {
    deleteDish(input: $input) {
      ok
      error
    }
  }
`);

const EditDish = () => {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();
  const [oldOptions, setOldOptions] = useState<any[] | null | undefined>([]);
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +restaurantId!,
        },
      },
    }
  );
  const editMenu = data?.myRestaurant.restaurant?.menu.filter(
    (dish) => dish.id === +dishId!
  );
  const oldOption = editMenu![0].options?.map((option, idx) => ({
    id: idx,
    name: option.name,
    extraPrice: option.extraPrice,
  }));

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const [editDishMutation, { data: editDishMutationResult }] = useMutation<
    EditDishMutation,
    EditDishMutationVariables
  >(EDIT_DISH_MUTATION, {
    onCompleted: (data: EditDishMutation) => {
      const {
        editDish: { ok },
      } = data;
      if (ok && data) {
        setUploading(false);
        navigate(`/restaurant/${restaurantId}`);
      }
    },
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId!,
          },
        },
      },
    ],
  });

  const [deleteDishMutation, { data: deleteDishResult }] = useMutation<
    DeleteDishMutation,
    DeleteDishMutationVariables
  >(DELETE_DISH_MUTATION, {
    onCompleted: (data: DeleteDishMutation) => {
      const {
        deleteDish: { ok },
      } = data;
      if (ok && data) {
        setUploading(false);
        navigate(-1);
      }
    },
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId!,
          },
        },
      },
    ],
  });

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { name, price, description, file, ...rest } = getValues();

      // 입력된 새로운 옵션
      const optionsNewObject = optionsNumber.map((theId) => ({
        id: theId,
        name: rest[`${theId}-optionName`],
        extraPrice: +rest[`${theId}-optionExtraPrice`],
      }));

      const x = oldOptions?.concat(optionsNewObject);
      const optionsObject = x!.map((option) => ({
        name: option.name,
        extraPrice: option.extraPrice,
      }));

      if (file.length === 0) {
        const photo = editMenu![0].photo;
        editDishMutation({
          variables: {
            input: {
              restaurantId: +restaurantId!,
              dishId: +dishId!,
              name,
              price: +price,
              photo,
              description,
              options: optionsObject,
            },
          },
        });
      } else if (file.lengh !== 0) {
        const actualFile = file[0];
        const formBody = new FormData();
        formBody.append("file", actualFile);
        // graphQl mutation을 통해 file을 처리하지 못한다. url 이 서로 다름.그래서 API post
        const { url: photo } = await (
          await fetch("http://localhost:4000/uploads/", {
            method: "POST",
            body: formBody,
          })
        ).json();

        editDishMutation({
          variables: {
            input: {
              restaurantId: +restaurantId!,
              dishId: +dishId!,
              name,
              price: +price,
              photo,
              description,
              options: optionsObject,
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onAddOptionClick = () => {
    setOptionsNumber((prev) => [Date.now(), ...prev]);
  };

  const onDeleteOptionClick = (idToDelete: number) => {
    setOptionsNumber((prev) => prev.filter((id) => id !== idToDelete));
  };

  const onDeleteOldOptionClick = (idx: number) => {
    setOldOptions((prev) => prev?.filter((option) => option.id !== idx));
  };

  const handleDelete = () => {
    window.alert("확인을 누르면 영구삭제됩니다.");
    setUploading(true);

    deleteDishMutation({
      variables: {
        input: {
          dishId: +dishId!,
        },
      },
    });
  };

  useEffect(() => {
    setOldOptions(oldOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>메뉴 수정하기 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <h4 className="w-full text-left text-2xl md:text-3xl font-medium pl-2">
          메뉴를 수정합니다.
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col mt-3 mb-3"
        >
          <div>
            <label htmlFor="name" className="text-sm text-gray-600 px-3 ">
              * 메뉴 이름 :
            </label>
            <input
              {...register("name", {
                required: "필수항목입니다.",
                minLength: 1,
                maxLength: 30,
              })}
              aria-invalid={errors.name ? true : false}
              name="name"
              type="text"
              id="name"
              placeholder="메뉴 이름"
              className="input"
              required
              defaultValue={editMenu![0].name || ""}
            />
          </div>
          {errors.name?.type === "minLength" && (
            <FormError errorMessage="1글자이상 입력하세요" />
          )}
          {errors.name?.type === "maxLength" && (
            <FormError errorMessage="30글자이하로 입력하세요" />
          )}
          <div className="pl-3 mb-4">
            <h4 className="text-sm text-gray-600 mt-4">
              * 메뉴의 대표이미지 파일을 선택해주세요.
            </h4>
            <input
              {...register("file")}
              accept="image/*"
              name="file"
              type="file"
              className="mt-3"
              defaultValue={null!}
            />
          </div>
          <div>
            <label htmlFor="price" className="text-sm text-gray-600 px-3 ">
              * 가격 :
            </label>
            <input
              {...register("price")}
              name="price"
              type="text"
              id="price"
              min={0}
              placeholder="메뉴 가격"
              className="input"
              defaultValue={editMenu![0].price || 0}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="text-sm text-gray-600 px-3 "
            >
              * 설명 :
            </label>
            <input
              {...register("description")}
              name="description"
              type="text"
              id="description"
              placeholder="메뉴 설명"
              className="input my-3 "
              defaultValue={editMenu![0].description || ""}
            />
          </div>
          <div className="mb-5 flex ">
            <span className="text-sm text-gray-600 px-3 ">* 옵션 :</span>
            {/* 기존 옵션이 렌더된다 */}
            <div className="flex flex-col">
              {oldOptions &&
                oldOptions.length !== 0 &&
                oldOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex justify-between text-gray-700 mb-2"
                  >
                    <h6 className="mr-8">
                      {option.name}{" "}
                      {option.extraPrice &&
                        `(${option.extraPrice.toLocaleString()}원)`}
                    </h6>
                    <span
                      onClick={() => onDeleteOldOptionClick(option.id)}
                      className="py-1 px-3 md:ml-5  text-sm w-14 border-2 border-red-500 text-red-500 cursor-pointer"
                    >
                      삭제
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <div className=" pl-3.5 mb-8">
            <span
              onClick={onAddOptionClick}
              className="cursor-pointer bg-blue-50 text-gray-800 p-1.5 border border-gray-600 rounded-sm"
            >
              새로운 옵션 만들기
            </span>

            {optionsNumber.length !== 0 &&
              optionsNumber.map((id) => (
                <div key={id} className="mt-5 flex flex-col sm:flex-row">
                  <input
                    {...register(`${id}-optionName`)}
                    type="text"
                    placeholder="옵션 이름(eg. 매운정도)"
                    className=" py-1 px-3 mb-1 md:mb-0 md:mr-5 text-sm  focus:outline-none border-2 focus:border-gray-600"
                  />
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start">
                      <input
                        {...register(`${id}-optionExtraPrice`)}
                        type="number"
                        min={0}
                        defaultValue={0}
                        className=" py-1 px-3 mb-1 md:mb-0 text-sm focus:outline-none border-2 focus:border-gray-600"
                      />
                      <div className=" text-sm">원</div>
                    </div>
                    <span
                      onClick={() => onDeleteOptionClick(id)}
                      className="py-1 px-3 md:ml-5  text-sm w-14 border-2 border-red-500 text-red-500 cursor-pointer"
                    >
                      삭제
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <Button
            canClick={isValid}
            loading={uploading}
            actionText="수정하기"
          />
          {editDishMutationResult?.editDish.error && (
            <FormError errorMessage={editDishMutationResult.editDish.error} />
          )}
          <div
            onClick={handleDelete}
            className=" mt-5 text-red-600 text-center cursor-pointer"
          >
            삭제하기
          </div>
          {deleteDishResult?.deleteDish.error && (
            <FormError errorMessage={deleteDishResult.deleteDish.error} />
          )}
        </form>
      </div>
    </div>
  );
};

export default EditDish;
