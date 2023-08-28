import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import FormError from "../../components/form-error";
import Button from "../../components/button";
import { gql } from "../../__generated__/gql";
import { useMutation } from "@apollo/client";
import {
  DeleteDishMutation,
  DeleteDishMutationVariables,
} from "../../__generated__/graphql";

const DELETE_DISH_MUTATION = gql(/* GraphQL */ `
  mutation deleteDish($input: DeleteDishInput!) {
    deleteDish(input: $input) {
      ok
      error
    }
  }
`);

const EditDish = () => {
  const params = useParams();
  const navigate = useNavigate();
  console.log(params.id);
  const [optionsNumber, setOptionsNumber] = useState([]);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

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
  });

  const onSubmit = () => {};

  const onAddOptionClick = () => {};

  const onDeleteOptionClick = (id: number) => {};

  const handleDelete = () => {
    window.alert("확인을 누르면 영구삭제됩니다.");
    setUploading(true);
    // 아이디를 들고 와서 backend에서 delete 하고 aws 에서 사진지우는 작업
    deleteDishMutation({
      variables: {
        input: {
          dishId: +params.id!,
        },
      },
    });
  };

  return (
    <div className=" h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>메뉴 만들기 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <h4 className="w-full text-left text-2xl md:text-3xl font-medium pl-2">
          메뉴를 수정합니다.
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
            placeholder="메뉴 이름"
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
            * 메뉴의 대표이미지 파일을 선택해주세요.
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
            {...register("price", {
              required: "필수항목입니다.",
            })}
            name="price"
            type="text"
            min={0}
            placeholder="메뉴 가격"
            className="input my-3"
            required
          />
          <input
            {...register("description", {
              required: "필수항목입니다.",
            })}
            name="description"
            type="text"
            placeholder="메뉴 설명"
            className="input my-3"
            required
          />
          <div className="mb-5">
            <h4 className="text-sm text-gray-400 pl-3 m-1">
              {" "}
              * 필요한 만큼 "옵션만들기" 버튼을 눌러, 메뉴의 다양한 옵션을
              만들수 있습니다.(기본값은 옵션없음)
            </h4>
            <div className="cursor-pointer input pl-3.5">
              <span
                onClick={onAddOptionClick}
                className=" bg-blue-50 text-gray-800 p-1.5 border border-gray-600 rounded-sm"
              >
                옵션 만들기
              </span>

              {optionsNumber.length !== 0 &&
                optionsNumber.map((id) => (
                  <div key={id} className="mt-5 flex flex-col md:flex-row">
                    <input
                      // {...register(`${id}-optionName`)}
                      type="text"
                      placeholder="옵션 이름(eg. 매운정도)"
                      className=" py-1 px-3 mb-1 md:mb-0 md:mr-5 text-sm  focus:outline-none border-2 focus:border-gray-600"
                    />
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center justify-start">
                        <input
                          // {...register(`${id}-optionExtraPrice`)}
                          type="number"
                          min={0}
                          defaultValue={0}
                          className=" py-1 px-3 mb-1 md:mb-0 text-sm focus:outline-none border-2 focus:border-gray-600"
                        />
                        <div className=" text-sm">원</div>
                      </div>
                      <span
                        onClick={() => onDeleteOptionClick(id)}
                        className="py-1 px-3 md:ml-5  text-sm w-14 border-2 border-red-500 text-red-500"
                      >
                        삭제
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <Button
            canClick={isValid}
            loading={uploading}
            actionText="메뉴 만들기"
          />
          {/* {createDishMutationResult?.createDish.error && (
          <FormError
            errorMessage={createDishMutationResult.createDish.error}
          />
        )} */}
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
