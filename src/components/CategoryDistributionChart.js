// src/components/CategoryDistributionChart.js
import React, { useContext, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "../utils/chartSetup"; // Import chart setup
import AppContext from "../context/AppContext";

const CategoryDistributionChart = ({ equipment }) => {
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

    // Mapping từ category key sang translation key (chuyển - thành _)
    const getCategoryTranslationKey = (categoryKey) => {
      const translationKey = categoryKey.replace(/-/g, '_');
      return `category_${translationKey}`;
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

    const categories = Object.keys(categoryCounts);
    const labels = categories.map(cat => t(getCategoryTranslationKey(cat)));
    const data = categories.map(cat => categoryCounts[cat]);
    const colors = categories.map(cat => categoryColors[cat] || '#6B7280');

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
  }, [equipment, theme, t]);

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
      <div className="relative h-64 md:h-80">
        <Doughnut 
          key={`category-distribution-${Date.now()}`}
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