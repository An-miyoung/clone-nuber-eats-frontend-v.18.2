import React from "react";
import { gql } from "../__generated__/gql";
import { useQuery } from "@apollo/client";
import { MeQuery, UserRole } from "../__generated__/graphql";
import { Route, Routes } from "react-router-dom";
import Restaurnats from "../pages/client/restaurnats";
import PageNotFound from "../pages/404";

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

const ClientRouters = [
  {
    path: "/",
    element: <Restaurnats />,
  },
];

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

  return (
    <Routes>
      {data.me.role === UserRole.Client &&
        ClientRouters.map((router, idx) => (
          <Route path={router.path} element={router.element} key={idx}></Route>
        ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default LoggedInRouter;
