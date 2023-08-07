/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n": types.MeDocument,
    "\n  query category($input: CategoryInput!) {\n    category(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        id\n        name\n        coverImg\n        address\n        isPromoted\n      }\n      category {\n        id\n        name\n        coverImg\n        slug\n        restaurantCount\n      }\n    }\n  }\n": types.CategoryDocument,
    "\n  query restaurant($input: RestaurantInput!) {\n    restaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n        menu {\n          id\n          name\n          price\n          photo\n          description\n          options {\n            name\n            extraPrice\n            choices {\n              name\n              extraPrice\n            }\n          }\n        }\n      }\n    }\n  }\n": types.RestaurantDocument,
    "\n  query restaurantsPage($input: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        id\n        name\n        coverImg\n        slug\n        restaurantCount\n      }\n    }\n    restaurants(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n      }\n    }\n  }\n": types.RestaurantsPageDocument,
    "\n  query searchRestaurant($input: SearchRestaurantInput!) {\n    searchRestaurant(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n      }\n    }\n  }\n": types.SearchRestaurantDocument,
    "\n  mutation createAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      error\n      token\n    }\n  }\n": types.LoginDocument,
    "\n  mutation createDish($input: CreateDishInput!) {\n    createDish(input: $input) {\n      ok\n      error\n    }\n  }\n": types.CreateDishDocument,
    "\n  mutation createRestaurant($input: CreateRestaurantInput!) {\n    createRestaurant(input: $input) {\n      ok\n      error\n      restaurantId\n    }\n  }\n": types.CreateRestaurantDocument,
    "\n  query myRestaurant($input: MyRestaurantInput!) {\n    myRestaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n        menu {\n          id\n          name\n          price\n          photo\n          description\n          options {\n            name\n            extraPrice\n            choices {\n              name\n              extraPrice\n            }\n          }\n        }\n      }\n    }\n  }\n": types.MyRestaurantDocument,
    "\n  query myRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n      }\n    }\n  }\n": types.MyRestaurantsDocument,
    "\n  mutation verifyEmail($input: VerifyEmailInput!) {\n    verifyEmail(input: $input) {\n      ok\n      error\n    }\n  }\n": types.VerifyEmailDocument,
    "\n        fragment VerifiedUser on User {\n          verified\n        }\n        ": types.VerifiedUserFragmentDoc,
    "\n  mutation editProfile($input: EditProfileInput!) {\n    editProfile(input: $input) {\n      ok\n      error\n    }\n  }\n": types.EditProfileDocument,
    "\n            fragment EditedUser on User {\n              email\n              verified\n            }\n            ": types.EditedUserFragmentDoc,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n"): (typeof documents)["\n  query me {\n    me {\n      id\n      email\n      role\n      verified\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query category($input: CategoryInput!) {\n    category(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        id\n        name\n        coverImg\n        address\n        isPromoted\n      }\n      category {\n        id\n        name\n        coverImg\n        slug\n        restaurantCount\n      }\n    }\n  }\n"): (typeof documents)["\n  query category($input: CategoryInput!) {\n    category(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        id\n        name\n        coverImg\n        address\n        isPromoted\n      }\n      category {\n        id\n        name\n        coverImg\n        slug\n        restaurantCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query restaurant($input: RestaurantInput!) {\n    restaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n        menu {\n          id\n          name\n          price\n          photo\n          description\n          options {\n            name\n            extraPrice\n            choices {\n              name\n              extraPrice\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query restaurant($input: RestaurantInput!) {\n    restaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n        menu {\n          id\n          name\n          price\n          photo\n          description\n          options {\n            name\n            extraPrice\n            choices {\n              name\n              extraPrice\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query restaurantsPage($input: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        id\n        name\n        coverImg\n        slug\n        restaurantCount\n      }\n    }\n    restaurants(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n      }\n    }\n  }\n"): (typeof documents)["\n  query restaurantsPage($input: RestaurantsInput!) {\n    allCategories {\n      ok\n      error\n      categories {\n        id\n        name\n        coverImg\n        slug\n        restaurantCount\n      }\n    }\n    restaurants(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query searchRestaurant($input: SearchRestaurantInput!) {\n    searchRestaurant(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n      }\n    }\n  }\n"): (typeof documents)["\n  query searchRestaurant($input: SearchRestaurantInput!) {\n    searchRestaurant(input: $input) {\n      ok\n      error\n      totalPages\n      totalResults\n      restaurants {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      error\n      token\n    }\n  }\n"): (typeof documents)["\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      error\n      token\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createDish($input: CreateDishInput!) {\n    createDish(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createDish($input: CreateDishInput!) {\n    createDish(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createRestaurant($input: CreateRestaurantInput!) {\n    createRestaurant(input: $input) {\n      ok\n      error\n      restaurantId\n    }\n  }\n"): (typeof documents)["\n  mutation createRestaurant($input: CreateRestaurantInput!) {\n    createRestaurant(input: $input) {\n      ok\n      error\n      restaurantId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query myRestaurant($input: MyRestaurantInput!) {\n    myRestaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n        menu {\n          id\n          name\n          price\n          photo\n          description\n          options {\n            name\n            extraPrice\n            choices {\n              name\n              extraPrice\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query myRestaurant($input: MyRestaurantInput!) {\n    myRestaurant(input: $input) {\n      ok\n      error\n      restaurant {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n        menu {\n          id\n          name\n          price\n          photo\n          description\n          options {\n            name\n            extraPrice\n            choices {\n              name\n              extraPrice\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query myRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n      }\n    }\n  }\n"): (typeof documents)["\n  query myRestaurants {\n    myRestaurants {\n      ok\n      error\n      restaurants {\n        id\n        name\n        coverImg\n        category {\n          name\n          slug\n        }\n        address\n        isPromoted\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation verifyEmail($input: VerifyEmailInput!) {\n    verifyEmail(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation verifyEmail($input: VerifyEmailInput!) {\n    verifyEmail(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n        fragment VerifiedUser on User {\n          verified\n        }\n        "): (typeof documents)["\n        fragment VerifiedUser on User {\n          verified\n        }\n        "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation editProfile($input: EditProfileInput!) {\n    editProfile(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation editProfile($input: EditProfileInput!) {\n    editProfile(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n            fragment EditedUser on User {\n              email\n              verified\n            }\n            "): (typeof documents)["\n            fragment EditedUser on User {\n              email\n              verified\n            }\n            "];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;