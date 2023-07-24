import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import CreateAccount from "../pages/create-account";
import PageNotFound from "../pages/404";

const LoggedOutRouter = () => (
  <Routes>
    <Route path="/create-account" element={<CreateAccount />} />
    <Route path="/" element={<Login />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default LoggedOutRouter;
