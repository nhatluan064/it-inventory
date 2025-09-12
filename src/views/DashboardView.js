// src/views/DashboardView.js
import React, { useRef, useLayoutEffect } from "react";

const DashboardView = ({
  equipment,
  pendingPurchaseCount,
  purchasingCount,
  purchasedCount,
  masterListCount,
  reportsCount,
  setActiveTab,
  t,
}) => {
  const scrollContainerRef = useRef(null);
  const lastScrollLeft = useRef(0);

  // Tính toán các số liệu thống kê từ prop 'equipment'
  const totalInventory = equipment.filter((e) =>
    [
      "available",
      "in-use",
      "maintenance",
      "liquidation",
      "out-of-stock",
      "broken",
    ].includes(e.status)
  ).length;
  const availableDevices = equipment.filter(
    (e) => e.status === "available"
  ).length;
  const inUseDevices = equipment.filter((e) => e.status === "in-use").length;
  const maintenanceCount = equipment.filter(
    (e) => e.status === "maintenance"
  ).length;
  const liquidationCount = equipment.filter(
    (e) => e.status === "liquidation"
  ).length;

  const handleCardClick = (tab) => {
    if (scrollContainerRef.current) {
      // Lưu vị trí cuộn hiện tại trước khi thay đổi tab
      lastScrollLeft.current = scrollContainerRef.current.scrollLeft;
    }
    setActiveTab(tab);
  };

  useLayoutEffect(() => {
    // Khôi phục vị trí cuộn sau khi component đã render xong
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = lastScrollLeft.current;
    }
  });

  // Component con để hiển thị từng thẻ thống kê, giờ là một nút bấm
  const StatCard = ({ title, value, gradient, onClick }) => (
    <button
      onClick={onClick}
      className={`rounded-lg p-4 text-white shadow-md ${gradient} w-48 flex-shrink-0 text-left transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
    >
      <p className="text-xs opacity-90 truncate">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </button>
  );

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {t("dashboard")}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
          {t("dashboard_desc")}
        </p>
      </div>

      {/* Vùng chứa có thể cuộn ngang với khoảng cách nhỏ hơn */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hide-scrollbar"
      >
        <div className="flex space-x-4">
          <StatCard
            title={t("master_list")}
            value={masterListCount}
            gradient="bg-gradient-to-r from-cyan-500 to-blue-500"
            onClick={() => handleCardClick("masterList")}
          />
          <StatCard
            title={t("pending_purchase_requests")}
            value={pendingPurchaseCount}
            gradient="bg-gradient-to-r from-gray-400 to-gray-500"
            onClick={() => handleCardClick("pendingPurchase")}
          />
          <StatCard
            title={t("in_purchasing_process")}
            value={purchasingCount}
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
            onClick={() => handleCardClick("purchasing")}
          />
          <StatCard
            title={t("purchased_waiting_import")}
            value={purchasedCount}
            gradient="bg-gradient-to-r from-teal-500 to-teal-600"
            onClick={() => handleCardClick("purchased")}
          />
          <StatCard
            title={t("total_inventory")}
            value={totalInventory}
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            onClick={() => handleCardClick("inventory")}
          />
          <StatCard
            title={t("available")}
            value={availableDevices}
            gradient="bg-gradient-to-r from-green-500 to-green-600"
            onClick={() => handleCardClick("inventory")}
          />
          <StatCard
            title={t("in_use")}
            value={inUseDevices}
            gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
            onClick={() => handleCardClick("allocated")}
          />
          <StatCard
            title={t("in_maintenance")}
            value={maintenanceCount}
            gradient="bg-gradient-to-r from-orange-500 to-orange-600"
            onClick={() => handleCardClick("maintenance")}
          />
          <StatCard
            title={t("pending_liquidation")}
            value={liquidationCount}
            gradient="bg-gradient-to-r from-slate-500 to-slate-600"
            onClick={() => handleCardClick("liquidation")}
          />
          <StatCard
            title={t("reports")}
            value={reportsCount}
            gradient="bg-gradient-to-r from-slate-600 to-slate-700"
            onClick={() => handleCardClick("reports")}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
