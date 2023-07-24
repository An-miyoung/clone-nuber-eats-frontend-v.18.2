import React from "react";
import NuberLogo from "./nuberLogo";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Header = () => {
  const { data } = useMe();

  return (
    <>
      {!data?.me.verified && (
        <div className=" bg-red-400 p-4 flex justify-center items-center text-sm text-white">
          <span>이메일인증이 필요합니다.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-1 max-w-screen-xl mx-auto flex justify-between items-center">
          <Link to="/">
            <div className=" w-28">
              <NuberLogo />
            </div>
          </Link>
          <Link to="/edit-profile">
            <span className="flex flex-row justify-between items-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-xl text-lime-700"
              />
              <div className=" text-base">{data?.me.email.split("@")[0]}</div>
            </span>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
