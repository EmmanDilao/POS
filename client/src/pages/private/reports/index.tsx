import React from "react";
import SalesChart from "./SalesChart";
import FeedbackPie from "./FeedbackPie";

const ReportsPage = () => (
  <div>
    <h2>Sales Report</h2>
    <SalesChart />
    <h2>Customer Satisfaction</h2>
    <FeedbackPie />
  </div>
);

export default ReportsPage;
