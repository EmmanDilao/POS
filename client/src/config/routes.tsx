import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Login from "../pages/guest/Login";
import Customers from "../pages/private/customers";
import BaseLayout from "../components/layouts/BaseLayout";
import PrivateRoute from "../middleware/PrivateRoute";
import CustomerList from "../pages/private/customers/list";
import CustomerCreate from "../pages/private/customers/create";
import CustomerEdit from "../pages/private/customers/edit";
import Products from "../pages/private/products";
import ProductList from "../pages/private/products/list";
import ProductCreate from "../pages/private/products/create";
import ProductEdit from "../pages/private/products/edit";
import Orders from "../pages/private/orders";
import OrderCreate from "../pages/private/orders/create";
import OrderList from "../pages/private/orders/list";
import OrderView from "../pages/private/orders/view";
import RoleRoute from "../middleware/RoleRoute";
import RoleBasedDashboardRedirect from "../pages/private/RoleBasedDashboardRedirect";
import ReportsDashboard from "../pages/private/reports/ReportsDashboard";
import ProductPerformanceChart from "../pages/private/reports/ProductPerformanceChart";


const AdminDashboard = () => <div>Admin Dashboard</div>;
const ManagerDashboard = () => <div>Manager Dashboard</div>;
const CashierDashboard = () => <div>Cashier Dashboard</div>;

const routes = [
  { path: "/", element: <Navigate to="login" /> },
  { path: "/login", element: <Login /> },
  {
    path: "/dashboard",
    element: <PrivateRoute element={<BaseLayout />} />,
    children: [
      { path: "", element: <RoleBasedDashboardRedirect /> },

      {
        path: "admin",
        element: (
          <RoleRoute roles={["admin"]}>
            <AdminDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "manager",
        element: (
          <RoleRoute roles={["manager"]}>
            <ManagerDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "cashier",
        element: (
          <RoleRoute roles={["cashier"]}>
            <CashierDashboard />
          </RoleRoute>
        ),
      },
      // Reports: Only admin and manager can view
      {
        path: "reports",
        element: (
          <RoleRoute roles={["admin", "manager"]}>
            <ReportsDashboard />
          </RoleRoute>
        ),
        children: [
          // Example: Add product performance route here
          {
            path: "product-performance",
            element: (
              <RoleRoute roles={["admin", "manager"]}>
                <ProductPerformanceChart />
              </RoleRoute>
            ),
          },
        ],
      },
      // Customers: Only admin can create/edit, manager can only view
      {
        path: "customers",
        element: (
          <RoleRoute roles={["admin", "manager"]}>
            <Customers />
          </RoleRoute>
        ),
        children: [
          { path: "", element: <CustomerList /> },
          { 
            path: "create", 
            element: (
              <RoleRoute roles={["admin"]}>
                <CustomerCreate />
              </RoleRoute>
            ) 
          },
          { 
            path: "edit/:id", 
            element: (
              <RoleRoute roles={["admin"]}>
                <CustomerEdit />
              </RoleRoute>
            ) 
          },
        ],
      },
      // Products: Both can view/edit, only admin can create
      {
        path: "products",
        element: (
          <RoleRoute roles={["admin", "manager"]}>
            <Products />
          </RoleRoute>
        ),
        children: [
          { path: "", element: <ProductList /> },
          { 
            path: "create", 
            element: (
              <RoleRoute roles={["admin"]}>
                <ProductCreate />
              </RoleRoute>
            ) 
          },
          { 
            path: "edit/:id", 
            element: (
              <RoleRoute roles={["admin", "manager"]}>
                <ProductEdit />
              </RoleRoute>
            ) 
          },
        ],
      },
      {
        path: "orders",
        element: (
          <RoleRoute roles={["admin", "manager", "cashier"]}>
            <Orders />
          </RoleRoute>
        ),
        children: [
          { path: "", element: <OrderList /> },
          { path: "create", element: <OrderCreate /> },
          { path: "view/:id", element: <OrderView /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" /> },
];

const AppRoutes = () => {
  const route = useRoutes(routes);
  return route;
};

export default AppRoutes;
