import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Helmet>
        <title>Page not Found | Nuber Eats</title>
      </Helmet>
      <h2 className=" font-semibold text-2xl mb-3">
        페이지가 존재하지 않습니다.
      </h2>
      <h4 className=" font-medium text-base mb-5">
        요청하신 페이지는 없어졌거나, 다른 주소로 이동한 페이지입니다.
      </h4>
      <Link to="/" className="link">
        home 으로 &rarr;
      </Link>
    </div>
  );
};

export default PageNotFound;
