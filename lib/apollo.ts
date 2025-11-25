import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.error(`[GraphQL error]: ${message}`);
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
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

