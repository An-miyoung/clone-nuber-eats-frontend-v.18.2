import React from "react";
import { isLoggedInVar } from "../apollo";
import { gql } from "../__generated__/gql";
import { useQuery } from "@apollo/client";
import { MeQuery } from "../__generated__/graphql";

const ME_QUERY = gql(/* GraphQL */ `
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`);

const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<MeQuery>(ME_QUERY);
  console.log(data);

  if (!data || loading || error) {
    return (
      // 부모가 있으면 h-full 이 먹지만, 아래처럼 이 컴포넌트안에서 부모가 없는 경우 h-screen
      <div className="h-screen flex items-center justify-center">
        <span className=" text-xl font-medium text-gray-500 tracking-wide">
          로딩중...
        </span>
      </div>
    );
  }

  return <div>Me Query</div>;
};

export default LoggedInRouter;
