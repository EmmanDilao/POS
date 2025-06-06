import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Chart.register(...registerables);

const POLL_INTERVAL = 10000; // 10 seconds

const ProductPerformanceChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    let poller: NodeJS.Timeout | undefined;

    const fetchData = () => {
      setLoading(true);
      setError(null);
      const params = `?start_date=${startDate.toISOString().slice(0, 10)}&end_date=${endDate.toISOString().slice(0, 10)}`;
      const token = localStorage.getItem('_token');

      if (!token) {
        setError("Not authenticated. Please login.");
        setLoading(false);
        return;
      }

      fetch(`http://localhost:8000/api/v1/reports/product-performance${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 403) throw new Error("403 Forbidden: Invalid or expired token.");
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
            setData(null);
            setError("No product performance data found for this period.");
          } else {
            const labels = res.data.map((entry) => entry.product || entry.product_name || entry.name || "-");
            const totalSales = res.data.map((entry) => entry.total_sales ?? 0);
            const totalQuantities = res.data.map((entry) => entry.total_quantity ?? entry.total_sold ?? 0);
            const chartData = {
              labels,
              datasets: [
                {
                  label: "Total Sales",
                  data: totalSales,
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                },
                {
                  label: "Total Quantity",
                  data: totalQuantities,
                  backgroundColor: "rgba(255, 159, 64, 0.5)",
                },
              ],
            };
            setData(chartData);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(
            err.message.includes("403")
              ? "Your session has expired or you do not have permission for this data. Please log in again."
              : err.message || "Failed to fetch product performance data."
          );
          setLoading(false);
        });
    };

    fetchData(); // Initial fetch

    poller = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      if (poller) clearInterval(poller);
    };
  }, [startDate, endDate]);

  return (
    <div style={{
      background: "#fff",
      padding: 32,
      borderRadius: 12,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      maxWidth: 800,
      margin: "32px auto"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Top Product Performance</h2>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 20,
        marginBottom: 20,
        flexWrap: "wrap"
      }}>
        <label>
          Start Date:{" "}
          <DatePicker
            selected={startDate}
            onChange={(date) => date && setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate}
            dateFormat="yyyy-MM-dd"
          />
        </label>
        <label>
          End Date:{" "}
          <DatePicker
            selected={endDate}
            onChange={(date) => date && setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
          />
        </label>
      </div>
      {loading ? (
        <div style={{ textAlign: "center" }}>Loading...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      ) : (
        data && (
          <div style={{ minHeight: 400 }}>
            <Bar
              data={data}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: false }
                },
                scales: {
                  x: { title: { display: true, text: "Product" } },
                  y: { title: { display: true, text: "Value" } }
                }
              }}
              height={400}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ProductPerformanceChart;
