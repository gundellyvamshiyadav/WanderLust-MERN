import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EarningsChart = ({ chartData }) => {
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Earnings (₹)",
        data: chartData.data,
        backgroundColor: "rgba(13, 110, 253, 0.7)",
        borderColor: "#0d6efd",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  return (
    <div
      className="card h-100 dashboard-chart-card"
      style={{
        maxWidth: "370px",
        minWidth: "220px",
        minHeight: "320px",
        maxHeight: "370px",
        margin: "0 auto",
      }}
    >
      <div className="card-header bg-light-subtle">
        <h5 className="mb-0">Monthly Earnings Overview</h5>
      </div>
      <div className="card-body">
        {chartData.data.some((d) => d > 0) ? (
          <Bar
            options={{
              ...options,
              maintainAspectRatio: false,
              aspectRatio: 1.5,
            }}
            data={data}
            height={180}
          />
        ) : (
          <p className="text-muted text-center py-3">
            No earnings data available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default EarningsChart;
