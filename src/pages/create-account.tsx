import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FormError from "../components/form-error";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button";
import NuberLogo from "../components/nuberLogo";
import { gql } from "../__generated__";
import { useMutation } from "@apollo/client";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole,
} from "../__generated__/graphql";

const CREATE_ACCOUNT_MUTATION = gql(/* GraphQL */ `
  mutation createAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`);

interface ICreateAccountForm {
  email: string;
  password: string;
  passwordConfirm: string;
  role: UserRole;
}

const CreateAccount = () => {
  const navigate = useNavigate();
  const [passwordConfirmError, setPasswordConfirmError] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ICreateAccountForm>({
    mode: "onBlur",
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;

    if (ok) {
      // redirect login page
      navigate("/");
    }
  };

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );

  const onSubmit: SubmitHandler<ICreateAccountForm> = (data) => {
    console.log(data);
    if (!loading) {
      const { email, password, passwordConfirm, role } = data;
      if (password !== passwordConfirm) {
        setPasswordConfirmError(false);
      } else if (password === passwordConfirm) {
        createAccountMutation({
          variables: {
            createAccountInput: {
              email,
              password,
              role,
            },
          },
        });
      }
    }
  };

  return (
    <div className=" h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>회원가입 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <div className="w-52 mb-10">
          <NuberLogo />
        </div>
        <h4 className="w-full text-left text-3xl font-medium pl-2">
          시작합니다.
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col mt-5 mb-3"
        >
          <input
            {...register("email", {
              required: "필수항목입니다.",
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            aria-invalid={errors.email ? true : false}
            name="email"
            type="email"
            placeholder="이메일"
            className="input"
            required
          />
          {errors.email?.type === "pattern" && (
            <FormError errorMessage="유효하지 않은 이메일입니다." />
          )}

          <input
            {...register("password", {
              required: "필수항목입니다.",
              minLength: 5,
              maxLength: 9,
            })}
            aria-invalid={errors.password ? true : false}
            name="password"
            type="password"
            placeholder="5글자이상 9글자이하의 비밀번호"
            className="input my-3"
            required
          />
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="5글자이상 입력하세요" />
          )}
          {errors.password?.type === "maxLength" && (
            <FormError errorMessage="9글자이하로 입력하세요" />
          )}
          <input
            {...register("passwordConfirm", {
              required: "필수항목입니다.",
            })}
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인"
            className="input my-3"
            required
          />
          {!passwordConfirmError && (
            <FormError errorMessage="비밀번호가 서로 다릅니다." />
          )}
          <h4 className="text-lg text-gray-400 pl-3 mb-1">
            주문 / 음식점소유주 / 배달 중 선택해주세요.
          </h4>
          <select
            {...register("role", {
              required: "필수항목입니다.",
            })}
            id="select"
            className="mb-4 input"
          >
            {Object.keys(UserRole).map((role, idx) => (
              <option key={`role-${idx}`} value={role}>
                {role === UserRole.Client
                  ? "주문"
                  : role === UserRole.Delivery
                  ? "배달"
                  : "음식점소유주"}
              </option>
            ))}
          </select>

          <Button canClick={isValid} loading={loading} actionText="회원가입" />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          이미 회원이신가요?{"  "}
          <Link to="/" className=" text-lime-600 underline hover:underline">
            로그인하세요.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
