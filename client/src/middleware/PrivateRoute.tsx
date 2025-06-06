import React from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/rootStore";
import type { JSX } from "@emotion/react/jsx-runtime";

type PrivateRouteProps = {
  element: JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const {
    rootStore: { authStore },
  } = useStore();

  // Loading UX
  if (authStore.isLoading) return <div>Loading...</div>;

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

export default observer(PrivateRoute);
