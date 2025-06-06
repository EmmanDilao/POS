import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../store/rootStore";

interface RoleRouteProps {
  roles: string[];
  children: React.ReactNode;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ roles, children }) => {
  const {
    rootStore: { authStore },
  } = useStore();

  const userRole = authStore.userRole;

  // Optionally show a loading spinner while loading the userRole
  if (userRole === undefined || userRole === null) {
    return <div>Loading...</div>;
  }

  if (!roles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default RoleRoute;
