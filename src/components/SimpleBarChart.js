// src/components/SimpleBarChart.js
import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import "../utils/chartSetup";
import AppContext from "../context/AppContext";

const SimpleBarChart = ({ title, data, labels }) => {
  const { theme } = useContext(AppContext);

  if (!data || !labels || data.length === 0 || labels.length === 0) {
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Không có dữ liệu để hiển thị
        </p>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [{
      label: 'Số lượng',
      data,
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title,
        color: theme === "dark" ? "#E5E7EB" : "#374151",
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
          stepSize: 1,
        }
      },
      x: {
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
        }
      }
    }
  };

  try {
    return (
      <div className="relative h-64 md:h-80">
        <Bar 
          data={chartData} 
          options={options}
          key={`simple-bar-${Date.now()}`}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">
          Lỗi hiển thị biểu đồ: {error.message}
        </p>
      </div>
    );
  }
};

export default SimpleBarChart;