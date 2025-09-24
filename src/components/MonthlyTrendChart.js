// src/components/MonthlyTrendChart.js
import React, { useContext, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "../utils/chartSetup"; // Import chart setup
import AppContext from "../context/AppContext";

const MonthlyTrendChart = ({ activityLogs, equipment }) => {
  const { theme, t } = useContext(AppContext);

  // Tạo dữ liệu xu hướng 30 ngày gần nhất
  const chartData = useMemo(() => {
    const last30Days = [];
    const today = new Date();
    
    // Tạo mảng 30 ngày gần nhất
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last30Days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('vi-VN', { 
          day: '2-digit',
          month: '2-digit' 
        })
      });
    }

    // Tính toán dữ liệu tích lũy
    let cumulativeImported = 0;
    let cumulativeAllocated = 0;
    let cumulativeMaintenance = 0;

    const trendData = last30Days.map(day => {
      const dayLogs = activityLogs.filter(log => 
        log.timestamp && log.timestamp.split('T')[0] === day.date
      );

      // Đếm số lượng nhập trong ngày
      const dailyImported = dayLogs.filter(log => 
        log.action?.includes('import') || 
        log.action === 'procurement-purchased'
      ).length;

      // Đếm số lượng xuất trong ngày
      const dailyAllocated = dayLogs.filter(log => 
        log.action?.includes('export') || 
        log.action?.includes('allocate')
      ).length;

      // Đếm số lượng bảo trì trong ngày
      const dailyMaintenance = dayLogs.filter(log => 
        log.action?.includes('repair') || 
        log.action?.includes('maintenance')
      ).length;

      cumulativeImported += dailyImported;
      cumulativeAllocated += dailyAllocated;
      cumulativeMaintenance += dailyMaintenance;

      return {
        label: day.label,
        imported: cumulativeImported,
        allocated: cumulativeAllocated,
        maintenance: cumulativeMaintenance,
        dailyActivity: dayLogs.length
      };
    });

    return {
      labels: trendData.map(day => day.label),
      datasets: [
        {
          label: t('chart_cumulative_import_label'),
          data: trendData.map(day => day.imported),
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: t('chart_cumulative_export_label'),
          data: trendData.map(day => day.allocated),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: t('chart_daily_activity_label'),
          data: trendData.map(day => day.dailyActivity),
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
        }
      ]
    };
  }, [activityLogs, t]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === "dark" ? "#E5E7EB" : "#374151",
          font: {
            size: 12,
          },
          boxWidth: 12,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: t('monthly_trend_chart_title'),
        color: theme === "dark" ? "#E5E7EB" : "#374151",
        font: {
          size: 14,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
        titleColor: theme === "dark" ? "#E5E7EB" : "#374151",
        bodyColor: theme === "dark" ? "#E5E7EB" : "#374151",
        borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: theme === "dark" ? "#374151" : "#E5E7EB",
        },
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
          font: {
            size: 10,
          },
          maxTicksLimit: 10, // Giới hạn số tick để không bị chen chúc
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        grid: {
          color: theme === "dark" ? "#374151" : "#E5E7EB",
        },
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: t('chart_cumulative_import_label'),
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: t('chart_daily_activity_label'),
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
        }
      },
    },
  };

  // Kiểm tra dữ liệu hợp lệ
  if (!activityLogs || !Array.isArray(activityLogs)) {
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('no_data_available')}
        </p>
      </div>
    );
  }

  try {
    return (
      <div className="relative h-64 md:h-80">
        <Line 
          key={`monthly-trend-${Date.now()}`}
          data={chartData} 
          options={options}
          redraw={true}
        />
      </div>
    );
  } catch (error) {
    console.error('MonthlyTrendChart render error:', error);
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">
          Lỗi hiển thị biểu đồ xu hướng
        </p>
      </div>
    );
  }
};

export default MonthlyTrendChart;