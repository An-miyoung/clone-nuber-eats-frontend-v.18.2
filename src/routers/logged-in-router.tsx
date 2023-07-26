import React from "react";
import { UserRole } from "../__generated__/graphql";
import { Route, Routes } from "react-router-dom";
import Restaurnats from "../pages/client/restaurnats";
import PageNotFound from "../pages/404";
import Header from "../components/header";
import { useMe } from "../hooks/useMe";
import ConfirmEmail from "../pages/user/confirm-email";
import EditProfile from "../pages/user/edit-profile";
import Search from "../pages/client/search";
import CategoryPage from "../pages/client/category";

const ClientRouters = [
  {
    path: "/",
    element: <Restaurnats />,
  },
  {
    path: "/confirm",
    element: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    element: <EditProfile />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/category/:slug",
    element: <CategoryPage />,
  },
];

const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

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
    <>
      <Header />
      <Routes>
        {data.me.role === UserRole.Client &&
          ClientRouters.map((router, idx) => (
            <Route
              path={router.path}
              element={router.element}
              key={idx}
            ></Route>
          ))}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default LoggedInRouter;
