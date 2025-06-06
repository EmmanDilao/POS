import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
Chart.register(...registerables);

const SalesChart = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = `?start_date=${startDate.toISOString().slice(0, 10)}&end_date=${endDate.toISOString().slice(0, 10)}`;
    const token = localStorage.getItem('_token'); // 👈 Use _token

    fetch(`http://localhost:8000/api/v1/reports/sales${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
          setData(null);
          setError("No sales data found for this period.");
        } else {
          const labels = res.data.map((entry: any) => entry.date);
          const sales = res.data.map((entry: any) => entry.total_sales);
          const chartData = {
            labels,
            datasets: [
              {
                label: "Total Sales",
                data: sales,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          };
          setData(chartData);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch sales data.");
        setLoading(false);
      });
  }, [startDate, endDate]);

  return (
    <div>
      {/* ...your date pickers and chart code... */}
    </div>
  );
};

export default SalesChart;
