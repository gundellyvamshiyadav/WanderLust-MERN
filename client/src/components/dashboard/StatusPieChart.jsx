import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusPieChart = ({ chartData }) => {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        hoverOffset: 4,
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
        <h5 className="mb-0">Booking Status Trends</h5>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center">
        {chartData.data.some((d) => d > 0) ? (
          <Pie
            data={data}
            width={180}
            height={180}
            options={{ maintainAspectRatio: false }}
          />
        ) : (
          <p className="text-muted text-center py-3">
            No booking data available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusPieChart;
