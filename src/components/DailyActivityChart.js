// src/components/DailyActivityChart.js
import React, { useContext, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "../utils/chartSetup"; // Import chart setup
import AppContext from "../context/AppContext";

const DailyActivityChart = ({ activityLogs }) => {
  const { theme, t } = useContext(AppContext);

  // Tạo dữ liệu cho biểu đồ hoạt động 7 ngày gần nhất
  const chartData = useMemo(() => {
    try {
      const last7Days = [];
      const today = new Date();
      
      // Tạo mảng 7 ngày gần nhất
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push({
          date: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('vi-VN', { 
            weekday: 'short', 
            day: '2-digit',
            month: '2-digit' 
          })
        });
      }

      // Đảm bảo activityLogs tồn tại và là array
      const validLogs = Array.isArray(activityLogs) ? activityLogs : [];

      // Đếm số hoạt động theo ngày và loại
      const dailyActivity = last7Days.map(day => {
        const dayLogs = validLogs.filter(log => 
          log && 
          log.timestamp && 
          typeof log.timestamp === 'string' &&
          log.timestamp.split('T')[0] === day.date
        );

        const importCount = dayLogs.filter(log => 
          log.action && (
            log.action.includes('import') || 
            log.action === 'procurement-purchased'
          )
        ).length;

        const exportCount = dayLogs.filter(log => 
          log.action && (
            log.action.includes('export') || 
            log.action.includes('allocate')
          )
        ).length;

        const maintenanceCount = dayLogs.filter(log => 
          log.action && (
            log.action.includes('repair') || 
            log.action.includes('maintenance')
          )
        ).length;

        const totalCount = dayLogs.length;

        return {
          label: day.label,
          import: importCount || 0,
          export: exportCount || 0,
          maintenance: maintenanceCount || 0,
          total: totalCount || 0
        };
      });

      return {
        labels: dailyActivity.map(day => day.label),
        datasets: [
          {
            label: t('chart_import_label') || 'Import',
            data: dailyActivity.map(day => day.import),
            backgroundColor: '#22C55E',
            borderColor: '#16A34A',
            borderWidth: 1,
          },
          {
            label: t('chart_export_label') || 'Export',
            data: dailyActivity.map(day => day.export),
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 1,
          },
          {
            label: t('chart_maintenance_label') || 'Maintenance',
            data: dailyActivity.map(day => day.maintenance),
            backgroundColor: '#F59E0B',
            borderColor: '#D97706',
            borderWidth: 1,
          },
          {
            label: t('chart_total_activity_label') || 'Total Activity',
            data: dailyActivity.map(day => day.total),
            backgroundColor: '#8B5CF6',
            borderColor: '#7C3AED',
            borderWidth: 1,
          }
        ]
      };
    } catch (error) {
      console.error('Error creating daily activity chart data:', error);
      return {
        labels: [],
        datasets: []
      };
    }
  }, [activityLogs, t]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        text: t('daily_activity_chart_title') || 'Hoạt động 7 ngày gần nhất',
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
      datalabels: {
        display: false // Tắt datalabels để tránh lỗi
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
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme === "dark" ? "#374151" : "#E5E7EB",
        },
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
          font: {
            size: 11,
          },
          stepSize: 1,
        },
      },
    },
  };

  // Kiểm tra dữ liệu hợp lệ
  if (!activityLogs || !Array.isArray(activityLogs)) {
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('no_data_available') || 'Không có dữ liệu'}
        </p>
      </div>
    );
  }

  try {
    return (
      <div className="relative h-64 md:h-80 overflow-hidden scrollbar-hide chart-container">
        <Bar 
          key={`daily-activity-${theme}`}
          data={chartData} 
          options={options}
          redraw={true}
        />
      </div>
    );
  } catch (error) {
    console.error('DailyActivityChart render error:', error);
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">
          Lỗi hiển thị biểu đồ hoạt động
        </p>
      </div>
    );
  }
};

export default DailyActivityChart;