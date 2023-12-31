import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm, SubmitHandler } from "react-hook-form";
import FormError from "../components/form-error";
import { useMutation } from "@apollo/client";
import { gql } from "../__generated__/gql";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/graphql";
import NuberLogo from "../components/nuberLogo";
import Button from "../components/button";
import { Link } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

const LOGIN_MUTATION = gql(/* GraphQL */ `
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`);

interface ILoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginForm>({
    mode: "onBlur",
  });

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit: SubmitHandler<ILoginForm> = (data) => {
    if (!loading) {
      const { email, password } = data;
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className=" h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title>로그인 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <div className="w-52 mb-10">
          <NuberLogo />
        </div>
        <h4 className="w-full text-left text-3xl font-medium pl-2">
          어서 오세요.
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

          <Button canClick={isValid} loading={loading} actionText="로그인" />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          처음이신가요?
          <span>{`  `}</span>
          <Link
            to="/create-account"
            className=" text-lime-600 underline hover:underline"
          >
            가입해서 계정을 만드세요.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
