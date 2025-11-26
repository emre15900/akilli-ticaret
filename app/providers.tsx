"use client";

import { ApolloProvider } from "@apollo/client/react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { apolloClient } from "@/lib/apollo";
import { store } from "@/store";
import { FavoritesPersistenceProvider } from "@/components/providers/FavoritesPersistenceProvider";
import { GlobalStatusBanner } from "@/components/ui/GlobalStatusBanner";

export const Providers = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <FavoritesPersistenceProvider />
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        pauseOnHover
        closeOnClick
        theme="light"
      />
      <GlobalStatusBanner />
    </Provider>
  </ApolloProvider>
);

