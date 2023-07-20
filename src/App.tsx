import React from "react";

import { useReactiveVar } from "@apollo/client";
import LoggedInRouter from "./routers/logged-in-router";
import { isLoggedInVar } from "./apollo";
import LoggedOutRouter from "./routers/logged-out-router";

function App() {
  // client cache 에 isLoggedIn 이라는 local field 를 선언하고
  // isLoggedIn 의 read method 가 변화되는 isLoggedVar()를 return 할때
  // 이 값을 불러오려면 gql query 문을 쓰고, useQuery hook 을 이용해 불러와야 하지만,
  // useReactiveVar() 로 한방에 해결
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
