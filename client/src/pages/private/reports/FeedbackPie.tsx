import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const FeedbackPie = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/v1/reports/feedback")
      .then((res) => res.json())
      .then((res) => {
        const labels = res.distribution.map((e: any) => `Rating ${e.rating}`);
        const counts = res.distribution.map((e: any) => e.count);
        setData({
          labels,
          datasets: [
            {
              label: "Feedback Ratings",
              data: counts,
              backgroundColor: [
                "#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF"
              ],
            },
          ],
        });
      });
  }, []);

  if (!data) return <div>Loading...</div>;

  return <Pie data={data} />;
};

export default FeedbackPie;
