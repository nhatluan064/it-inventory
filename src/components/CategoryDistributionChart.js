// src/components/CategoryDistributionChart.js
import React, { useContext, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "../utils/chartSetup"; // Import chart setup
import AppContext from "../context/AppContext";

const CategoryDistributionChart = ({ equipment, categories }) => {
  const { theme, t } = useContext(AppContext);

  // Tạo dữ liệu phân bổ theo danh mục
  const chartData = useMemo(() => {
    // Chỉ tính các thiết bị trong kho chính (không tính master và quy trình mua hàng)
    const mainInventory = equipment.filter(item => 
      !['master', 'pending-purchase', 'purchasing', 'purchased'].includes(item.status)
    );

    // Đếm số lượng theo danh mục
    const categoryCounts = mainInventory.reduce((acc, item) => {
      const categoryKey = item.category || 'other';
      acc[categoryKey] = (acc[categoryKey] || 0) + 1;
      return acc;
    }, {});

    // Mapping từ category key sang tên hiển thị
    const getCategoryDisplayName = (categoryKey) => {
      // Tìm trong danh sách categories tùy chỉnh trước
      const customCategory = categories?.find(cat => cat.id === categoryKey);
      if (customCategory) {
        return customCategory.name;
      }
      
      // Nếu không tìm thấy, sử dụng translation key mặc định
      const translationKey = categoryKey.replace(/-/g, '_');
      return t(`category_${translationKey}`);
    };

    // Màu sắc cho từng danh mục (sử dụng key với dấu gạch ngang như trong dữ liệu thực tế)
    const categoryColors = {
      'pc': '#3B82F6',              // blue-500
      'mini-pc': '#06B6D4',         // cyan-500  
      'laptop': '#8B5CF6',          // violet-500
      'monitor': '#10B981',         // emerald-500
      'keyboard': '#F59E0B',        // amber-500
      'mouse': '#EF4444',           // red-500
      'printer': '#EC4899',         // pink-500
      'label-printer': '#84CC16',   // lime-500
      'photocopier': '#6366F1',     // indigo-500
      'printer-ink': '#F97316',     // orange-500
      'network-device': '#14B8A6',  // teal-500
      'network-cable': '#A855F7',   // purple-500
      'other': '#6B7280'            // gray-500
    };

    // Danh sách màu sắc bổ sung cho các danh mục tùy chỉnh
    const additionalColors = [
      '#DC2626', // red-600
      '#EA580C', // orange-600
      '#CA8A04', // yellow-600
      '#16A34A', // green-600
      '#0891B2', // cyan-600
      '#2563EB', // blue-600
      '#7C3AED', // violet-600
      '#C026D3', // fuchsia-600
      '#BE123C', // rose-600
      '#9A3412', // amber-900
      '#365314', // lime-900
      '#0F766E', // teal-700
      '#1E3A8A', // blue-800
      '#581C87', // violet-900
      '#7F1D1D', // red-900
      '#92400E', // amber-800
      '#3F6212', // lime-800
      '#134E4A', // teal-900
      '#1E40AF', // blue-700
      '#6B21A8', // violet-800
    ];

    const categoriesKeys = Object.keys(categoryCounts);
    const labels = categoriesKeys.map(cat => getCategoryDisplayName(cat));
    const data = categoriesKeys.map(cat => categoryCounts[cat]);
    
    // Tạo màu sắc cho từng danh mục
    const colors = categoriesKeys.map((cat, index) => {
      // Nếu có màu được định nghĩa sẵn, sử dụng nó
      if (categoryColors[cat]) {
        return categoryColors[cat];
      }
      
      // Nếu là danh mục tùy chỉnh, tạo màu ngẫu nhiên nhưng nhất quán
      const colorIndex = index % additionalColors.length;
      return additionalColors[colorIndex];
    });

    return {
      labels,
      datasets: [{
        label: t("quantity"),
        data,
        backgroundColor: colors,
        borderColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
        borderWidth: 2,
      }]
    };
  }, [equipment, categories, theme, t]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme === "dark" ? "#E5E7EB" : "#374151",
          font: {
            size: 11,
          },
          boxWidth: 15,
          padding: 10,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: t('category_distribution_title'),
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
        display: function(context) {
          // Chỉ hiển thị label nếu giá trị > 0
          return context.parsed > 0;
        },
        color: '#FFFFFF',
        font: {
          weight: 'bold',
          size: 10
        },
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          // Hiển thị số nếu phần trăm >= 3% để tránh cluttered
          return percentage >= 3 ? `${value}` : '';
        },
        textAlign: 'center',
        textStrokeColor: '#000000',
        textStrokeWidth: 1
      },
      tooltip: {
        backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
        titleColor: theme === "dark" ? "#E5E7EB" : "#374151",
        bodyColor: theme === "dark" ? "#E5E7EB" : "#374151",
        borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
  };

  // Kiểm tra dữ liệu hợp lệ
  if (!equipment || !Array.isArray(equipment) || equipment.length === 0) {
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
      <div className="relative h-64 md:h-80 overflow-hidden scrollbar-hide chart-container">
        <Doughnut 
          key={`category-distribution-${theme}`}
          data={chartData} 
          options={options}
          redraw={true}
        />
      </div>
    );
  } catch (error) {
    console.error('CategoryDistributionChart render error:', error);
    return (
      <div className="relative h-64 md:h-80 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">
          Lỗi hiển thị biểu đồ phân bố
        </p>
      </div>
    );
  }
};

export default CategoryDistributionChart;