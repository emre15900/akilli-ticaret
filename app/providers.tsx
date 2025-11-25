"use client";

import { ApolloProvider } from "@apollo/client/react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { apolloClient } from "@/lib/apollo";
import { store } from "@/store";
import { FavoritesPersistenceProvider } from "@/components/providers/FavoritesPersistenceProvider";
import { GlobalStatusBanner } from "@/components/ui/GlobalStatusBanner";

export const Providers = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <FavoritesPersistenceProvider />
      {children}
      <GlobalStatusBanner />
    </Provider>
  </ApolloProvider>
);

