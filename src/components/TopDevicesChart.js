// src/components/TopDevicesChart.js
import React, { useContext, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "../utils/chartSetup"; // Import chart setup
import AppContext from "../context/AppContext";

const TopDevicesChart = ({ equipment }) => {
  const { theme, t } = useContext(AppContext);

  // Debug: log data (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('TopDevicesChart equipment:', equipment);
  }

  // Tạo dữ liệu Top 5 thiết bị được sử dụng nhiều nhất
  const chartData = useMemo(() => {
    try {
      // Lọc các thiết bị có trong hệ thống (không tính master và quy trình mua hàng)
      const activeDevices = equipment.filter(item => 
        item && 
        item.status && 
        !['master', 'pending-purchase', 'purchasing', 'purchased'].includes(item.status)
      );

      // Nhóm theo tên thiết bị và đếm số lượng
      const deviceCounts = activeDevices.reduce((acc, item) => {
        const deviceName = item.name || 'Unnamed Device';
        if (!acc[deviceName]) {
          acc[deviceName] = {
            total: 0,
            inUse: 0,
            available: 0,
            maintenance: 0,
            liquidation: 0
          };
        }
        
        acc[deviceName].total += 1;
        
        switch (item.status) {
          case 'in-use':
            acc[deviceName].inUse += 1;
            break;
          case 'available':
            acc[deviceName].available += 1;
            break;
          case 'maintenance':
            acc[deviceName].maintenance += 1;
            break;
          case 'liquidation':
            acc[deviceName].liquidation += 1;
            break;
          default:
            break;
        }
        
        return acc;
      }, {});

      // Sắp xếp theo tổng số lượng và lấy Top 5
      const sortedDevices = Object.entries(deviceCounts)
        .filter(([, counts]) => counts.total > 0)
        .sort(([,a], [,b]) => (b?.total || 0) - (a?.total || 0))
        .slice(0, 5);

      if (sortedDevices.length === 0) {
        return {
          labels: [],
          datasets: []
        };
      }

      const labels = sortedDevices.map(([name]) => 
        name && name.length > 20 ? name.substring(0, 20) + '...' : name || 'Unknown'
      );
      
      const totalData = sortedDevices.map(([,counts]) => counts?.total || 0);
      const inUseData = sortedDevices.map(([,counts]) => counts?.inUse || 0);
      const availableData = sortedDevices.map(([,counts]) => counts?.available || 0);

      return {
        labels,
        datasets: [
          {
            label: t('available'),
            data: availableData,
            backgroundColor: '#22C55E',
            borderColor: '#16A34A',
            borderWidth: 1,
          },
          {
            label: t('in_use'),
            data: inUseData,
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 1,
          },
          {
            label: t('total') || 'Tổng',
            data: totalData,
            backgroundColor: '#8B5CF6',
            borderColor: '#7C3AED',
            borderWidth: 1,
          }
        ]
      };
    } catch (error) {
      console.error('Error creating chart data:', error);
      return {
        labels: [],
        datasets: []
      };
    }
  }, [equipment, t]);

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
        text: t('top_devices_title') || 'Top 5 thiết bị phổ biến nhất',
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
      datalabels: {
        display: false // Tắt datalabels để tránh lỗi
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
          maxRotation: 45,
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
          stepSize: 1,
        },
        title: {
          display: true,
          text: t('quantity') || 'Số lượng',
          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
        }
      },

    },
  };

  // Kiểm tra dữ liệu hợp lệ
  if (!equipment || !Array.isArray(equipment) || equipment.length === 0) {
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {t('no_data_available') || 'Không có dữ liệu'}
          </p>
          <p className="text-xs text-gray-400">
            Type: {typeof equipment}, IsArray: {Array.isArray(equipment).toString()}, Length: {equipment?.length || 0}
          </p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="relative h-64 md:h-80 overflow-hidden scrollbar-hide chart-container">
        <Bar 
          key={`top-devices-${theme}`}
          data={chartData} 
          options={options}
          redraw={true}
        />
      </div>
    );
  } catch (error) {
    console.error('TopDevicesChart render error:', error);
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">
          Lỗi hiển thị biểu đồ
        </p>
      </div>
    );
  }
};

export default TopDevicesChart;