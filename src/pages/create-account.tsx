import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FormError from "../components/form-error";
import { Helmet } from "react-helmet-async";

interface ICreateAccountForm {
  email: string;
  password: string;
}

const CreateAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateAccountForm>();

  const onSubmit: SubmitHandler<ICreateAccountForm> = (data) => {
    console.log(data);
  };

  return (
    <div className=" h-screen flex items-center justify-center bg-gray-800">
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className=" bg-white w-full max-w-screen-sm p-8 rounded-lg text-center">
        <h1 className=" font-bold text-3xl text-gray-800">Log In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col mt-5">
          <input
            {...register("email", {
              required: "필수항목입니다.",
              pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
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
            className="input mt-3"
            required
          />
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="5글자이상 입력하세요" />
          )}
          {errors.password?.type === "maxLength" && (
            <FormError errorMessage="9글자이하로 입력하세요" />
          )}

          <button className="btn mt-3">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
