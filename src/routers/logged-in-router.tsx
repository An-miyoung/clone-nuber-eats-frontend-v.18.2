import React from "react";
import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => {
  const onBtnClick = () => {
    isLoggedInVar(false);
  };
  return (
    <div>
      <h1 className="text-xl bg-yellow-400">logged In</h1>
      <button onClick={onBtnClick}>Click to Logout</button>
    </div>
  );
};
