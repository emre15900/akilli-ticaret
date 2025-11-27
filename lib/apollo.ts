import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const apiGuid = process.env.NEXT_PUBLIC_API_GUID;

if (!endpoint) {
  throw new Error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined");
}

const httpLink = new HttpLink({
  uri: endpoint,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    GUID: apiGuid ?? "",
  },
}));

const errorLink = onError(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message }) => {
      console.error(`[GraphQL error]: ${message}`);
    });
    return;
  }

  console.error(`[Network error]: ${error}`);
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
});

