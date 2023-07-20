import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import CreateAccount from "../pages/create-account";

const LoggedOutRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default LoggedOutRouter;
