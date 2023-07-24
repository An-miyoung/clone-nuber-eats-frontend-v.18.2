import { gql } from "../__generated__/gql";
import { useQuery } from "@apollo/client";
import { MeQuery } from "../__generated__/graphql";

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

export const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};
