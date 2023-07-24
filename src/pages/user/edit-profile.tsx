import React from "react";
import { Helmet } from "react-helmet-async";
import { useApolloClient, useMutation, gql as Gql } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { gql } from "../../__generated__/gql";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../__generated__/graphql";
import { useMe } from "../../hooks/useMe";
import { LOCALSTORAGE_TOKEN } from "../../constants";
import { authTokenVar, isLoggedInVar } from "../../apollo";
import FormError from "../../components/form-error";
import Button from "../../components/button";
import { useNavigate } from "react-router-dom";

const EDIT_PROFILE_MUTATION = gql(/* GraphQL */ `
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`);

interface IProfileProps {
  email: string;
  password?: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  // useMe 훅은 cache 있으면 cache 내용을 돌려주고, 없으면 DB 에서 읽어온다.
  const { data: userData } = useMe();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IProfileProps>({
    defaultValues: {
      email: userData?.me.email || "이메일",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<IProfileProps> = (data) => {
    const { email, password } = data;

    editProfileMutation({
      variables: {
        input: {
          // 이메일은 default 로 현재 이메일값이 들어가거나 바뀐 이멜이 들어가므로 문제없음
          email,
          // 비밀번호는 사용자가 바꾸려는 항목이 아니면 "" 형태로 있음
          // password 가 있으면 password 항목도 만들고 값도 리턴하시오
          // 백엔드의 로직이 비밀번호를 고치지 않는 경우, 아예 비밀번호라는 항목이 없는 구조.
          ...(password !== "" && { password }),
        },
      },
    });
  };

  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEamil } = getValues();

      if (prevEmail !== newEamil) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: Gql`
            fragment EditedUser on User {
              email
              verified
            }
            `,
          data: {
            email: newEamil,
            verified: false,
          },
        });
      }
    }
  };

  const [editProfileMutation, { data: e_p_mutationResult, loading }] =
    useMutation<EditProfileMutation, EditProfileMutationVariables>(
      EDIT_PROFILE_MUTATION,
      {
        onCompleted,
      }
    );

  const handleLogout = () => {
    window.alert("확인을 누르면 로그아웃됩니다.");
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar("");
    isLoggedInVar(false);
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>개인정보 수정 | Nuber Eats</title>
      </Helmet>
      <div
        className="px-7 flex justify-end cursor-pointer text-gray-600"
        onClick={handleLogout}
      >
        로그아웃
      </div>
      <div className=" h-screen flex flex-col items-center mt-10 lg:mt-28">
        <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
          <h4 className="font-semibold text-2xl mb-5">개인정보 수정</h4>
          <h4 className="w-full text-gray-600 text-sm text-left pl-5">
            * 수정할 항목에 내용을 입력해 주세요
          </h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full grid gap-3 mb-5"
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
                minLength: 5,
                maxLength: 9,
              })}
              aria-invalid={errors.password ? true : false}
              name="password"
              type="password"
              placeholder="5글자이상 9글자이하의 비밀번호"
              className="input my-3"
            />
            {errors.password?.type === "minLength" && (
              <FormError errorMessage="5글자이상 입력하세요" />
            )}
            {errors.password?.type === "maxLength" && (
              <FormError errorMessage="9글자이하로 입력하세요" />
            )}

            <Button
              canClick={isValid}
              loading={loading}
              actionText="수정하기"
            />
            {e_p_mutationResult?.editProfile.error && (
              <FormError errorMessage={e_p_mutationResult.editProfile.error} />
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
