import React from "react";
import { isLoggedInVar } from "../apollo";

export const LoggedOutRouter = () => {
  const onBtnClick = () => {
    isLoggedInVar(true);
  };
  return (
    <div>
      <h1 className=" bg-gray-400 text-xl">logged out</h1>
      <button onClick={onBtnClick}>Click to Login</button>
    </div>
  );
};
