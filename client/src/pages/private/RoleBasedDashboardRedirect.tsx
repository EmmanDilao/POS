import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../../store/rootStore";

const roleDefaultRoute: Record<string, string> = {
  admin: "customers",
  manager: "customers",
  cashier: "orders",
  // Add other roles as needed
};

const RoleBasedDashboardRedirect = () => {
  const {
    rootStore: { authStore },
  } = useStore();
  const userRole = authStore.userRole;

  if (!userRole) return null; // or a loading spinner if you prefer

  const defaultRoute = roleDefaultRoute[userRole] || "orders";
  return <Navigate to={defaultRoute} replace />;
};

export default RoleBasedDashboardRedirect;
