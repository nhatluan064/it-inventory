// src/components/StatusChart.js
import React, { useContext, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import "../utils/chartSetup"; // Import chart setup
import AppContext from "../context/AppContext";

const StatusChart = React.memo(({ chartData }) => {
  const { theme, t } = useContext(AppContext);

  // Anh xa mau tu Tailwind sang ma mau thuc te cho bieu do (7 trang thai)
  const statusColorMapping = {
    "pending-purchase": "#9CA3AF", // gray-400 - Yeu cau mua
    "purchasing": "#A855F7", // purple-500 - Dang mua
    "purchased": "#14B8A6", // teal-500 - Da mua
    "total-inventory": "#3B82F6", // blue-500 - Tong kho
    "in-use": "#EAB308", // yellow-500 - Da xuat
    "maintenance": "#F97316", // orange-500 - Bao tri
    "liquidation": "#64748B", // slate-500 - Thanh ly
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: t("quantity"),
        data: chartData.data,
        backgroundColor: chartData.statusKeys.map(
          (key) => statusColorMapping[key] || "#6B7280"
        ), // Dùng màu xám cho các trạng thái khác
        borderColor: theme === "dark" ? "#1F2937" : "#FFFFFF", // Màu viền của các miếng bánh
        borderWidth: 2,
      },
    ],
  };

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: theme === "dark" ? "#F9FAFB" : "#374151",
          font: {
            size: 12,
          },
          boxWidth: 20,
          padding: 20,
          generateLabels: function (chart) {
            const data = chart.data;
            const legendColor = theme === "dark" ? "#F9FAFB" : "#374151";
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: ${value}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth,
                  fontColor: legendColor,
                  color: legendColor, // Thêm property này
                  textColor: legendColor, // Thêm property này
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      datalabels: {
        display: function (context) {
          // Chỉ hiển thị label nếu giá trị > 0
          return context.parsed > 0;
        },
        color: "#FFFFFF",
        font: {
          weight: "bold",
          size: 11,
        },
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          // Chỉ hiển thị số nếu phần trăm >= 5% để tránh cluttered
          return percentage >= 5 ? `${value}` : "";
        },
        textAlign: "center",
        textStrokeColor: "#000000",
        textStrokeWidth: 1,
      },
      tooltip: {
        backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
        titleColor: theme === "dark" ? "#E5E7EB" : "#374151",
        bodyColor: theme === "dark" ? "#E5E7EB" : "#374151",
        borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce(
              (sum, val) => sum + val,
              0
            );
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  }), [theme]);

  // Kiểm tra dữ liệu hợp lệ
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t("no_data_available")}
        </p>
      </div>
    );
  }

  try {
    return (
      <div className="relative h-64 md:h-80 overflow-hidden scrollbar-hide chart-container">
        <Pie
          key={`status-chart-${theme}`}
          data={data}
          options={options}
          redraw={true}
        />
      </div>
    );
  } catch (error) {
    console.error("StatusChart render error:", error);
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">
          Lỗi hiển thị biểu đồ trạng thái
        </p>
      </div>
    );
  }
});

export default StatusChart;
