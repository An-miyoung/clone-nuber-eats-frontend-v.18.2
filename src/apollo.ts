import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

// const wsLink = new WebSocketLink({
//   uri: `ws://localhost:4000/graphql`,
//   options: {
//     reconnect: true,
//     connectionParams: {
//       "x-jwt": authTokenVar() || "",
//     },
//   },
// });

// 진행상태를 subscribe 할 수 있게 해주는 게 websocket link
const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "wss://clone-uber-eats-backend.herokuapp.com/graphql"
      : "ws://localhost:4000/graphql",
  options: {
    connectionParams: {
      "x-jwt": authTokenVar() || "",
    },
  },
});

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://clone-uber-eats-backend.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",
});
// http 를 통해 인증된 상태임을 backend 에 보내줄때 사용
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

// apollo docs 에 나온 코드사용. 세번쩨 httpLink 대신 authLink.concat(httpLink) 사용
// split link 는 3부분으로 구성되어있다. 첫번째는 링크를 해주는 함수.
// 두번째는 함수의 return 값이 true 일때 연결된 링크
// 세번째는 함수의 return 값이 false 일때 연결된 링크
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  // authLink.concat(httpLink) 대신 http와 ws 가 결합된 splitLink 사용
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
