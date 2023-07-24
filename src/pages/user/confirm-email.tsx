import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useApolloClient, useMutation, gql as Gql } from "@apollo/client";
import { useMe } from "../../hooks/useMe";
import { gql } from "../../__generated__/gql";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";

const VERIFY_EMAIL_MUTATION = gql(/* GraphQL */ `
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`);

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const client = useApolloClient();
  const { data: userData } = useMe();

  const onCompleted = (data: VerifyEmailMutation) => {
    // 처리속도를 높이기 위해 DB 에 쓰기 전에 apollo cache 내용을 먼저 바꿔준다.
    // writeFragment 는 id, fragment, data 를 입력해주면 오류가 사라진다.
    // gql 을 @apollo/client 에서 사용해야 한다는 점
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: Gql`
        fragment verifiedUser on User {
          verified
        }
        `,
        data: {
          verified: true,
        },
      });
      navigate("/");
    }
  };

  const [verifyEmailMutation] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    const code = searchParams.get("code") || "";
    // DB 에 고쳐쓰는 작업
    verifyEmailMutation({
      variables: {
        input: {
          code,
        },
      },
    });
  }, [searchParams, verifyEmailMutation]);

  return (
    <div>
      <Helmet>
        <title>이메일 인증 중... | Nuber Eats</title>
      </Helmet>
      <div className=" h-20 mt-52 flex flex-col justify-between items-center">
        <h1 className=" text-lg">이메일 인증 중 ...</h1>
        <h4 className=" text-sm text-gray-700 break-all whitespace-nowrap">
          이 페이지를 닫지 마시고 조금만 기다려주세요.
        </h4>
      </div>
    </div>
  );
};

export default ConfirmEmail;
