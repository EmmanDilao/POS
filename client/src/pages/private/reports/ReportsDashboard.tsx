import React from "react";
import { useStore } from "../../../store/rootStore";
import { Navigate } from "react-router-dom";
import SalesChart from "./SalesChart";
import ProductPerformanceChart from "./ProductPerformanceChart";

const ReportsDashboard = () => {
  const {
    rootStore: { authStore },
  } = useStore();

  const isManagerOrAdmin = ["manager", "admin"].includes(authStore.userRole || "");

  if (!isManagerOrAdmin) {
    // Redirect to home or forbidden page
    return <Navigate to="/forbidden" replace />;
    // Or show a forbidden message:
    // return <div>Access Denied. You do not have permission to view this page.</div>
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafbff" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 16px 16px 16px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            margin: "36px 0 16px",
            fontWeight: 700,
          }}
        >
          Reports Dashboard
        </h1>

        <div style={{ margin: "56px 0" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: 24 }}>Sales Over Time</h2>
          <SalesChart />
        </div>

        <div style={{ margin: "56px 0" }}>
          <ProductPerformanceChart />
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
