// src/views/DashboardView.js
import React, { useRef, useEffect, useLayoutEffect } from "react";
import {
  ClipboardList,
  FilePlus,
  ShoppingCart,
  CheckCircle,
  Package,
  UserCheck,
  Home,
  Wrench,
  Trash2,
  FileText,
  LogOut,
} from "lucide-react";

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
  const scrollPos = useRef(0);

  const handleCardClick = (tabId) => {
    if (scrollContainerRef.current) {
      scrollPos.current = scrollContainerRef.current.scrollLeft;
    }
    setActiveTab(tabId);
  };

  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPos.current;
    }
  });

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel);

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const totalInventory = equipment.filter((e) =>
    ["available", "in-use", "maintenance", "liquidation", "broken"].includes(
      e.status
    )
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

  const StatCard = ({
    IconComponent,
    title,
    value,
    gradient,
    tabId,
    wide = false,
  }) => (
    <button
      onClick={() => handleCardClick(tabId)}
      className={`rounded-lg p-4 text-white shadow-md ${gradient} ${
        wide ? "w-64" : "w-48"
      } flex-shrink-0 text-left transition-transform transform hover:-translate-y-1 cursor-pointer flex items-center space-x-4`}
    >
      {IconComponent && (
        <IconComponent className="w-8 h-8 opacity-75 flex-shrink-0" />
      )}
      <div>
        <p className="text-xs opacity-90 truncate">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </button>
  );

  const CombinedStatCard = ({
    IconComponent,
    title1,
    value1,
    title2,
    value2,
    gradient,
    tabId,
  }) => (
    <button
      onClick={() => handleCardClick(tabId)}
      className={`rounded-lg shadow-md ${gradient} w-64 flex-shrink-0 transition-transform transform hover:-translate-y-1 cursor-pointer overflow-hidden flex items-center p-4 space-x-4`}
    >
      {IconComponent && (
        <IconComponent className="w-8 h-8 opacity-75 flex-shrink-0" />
      )}
      <div className="flex-grow flex items-center">
        <div className="w-1/2 text-white text-left">
          <p className="text-xs opacity-90 truncate">{title1}</p>
          <p className="text-xl font-bold">{value1}</p>
        </div>
        <div className="border-l-2 border-white/50 h-10 self-center mx-2"></div>
        <div className="w-1/2 text-white text-left">
          <p className="text-xs opacity-90 truncate">{title2}</p>
          <p className="text-xl font-bold">{value2}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="overflow-hidden space-y-6 animate-scaleIn">
      {/* ---- DÒNG ĐÃ SỬA LỖI ---- */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 flex space-x-4 cursor-grab active:cursor-grabbing hide-scrollbar"
      >
        {/* V-- THÊM THẺ MỚI TẠI ĐÂY --V */}
        <StatCard
          IconComponent={Home}
          title={t("nav_title_main")}
          value={t("home")}
          gradient="bg-gradient-to-r from-gray-500 to-gray-600"
          tabId="home"
        />
        <StatCard
          IconComponent={ClipboardList}
          title={t("master_list")}
          value={masterListCount}
          gradient="bg-gradient-to-r from-cyan-500 to-cyan-600"
          tabId="masterList"
        />
        <StatCard
          IconComponent={FilePlus}
          title={t("pending_purchase_requests")}
          value={pendingPurchaseCount}
          gradient="bg-gradient-to-r from-gray-400 to-gray-500"
          tabId="pendingPurchase"
        />
        <StatCard
          IconComponent={ShoppingCart}
          title={t("in_purchasing_process")}
          value={purchasingCount}
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          tabId="purchasing"
        />
        <StatCard
          IconComponent={CheckCircle}
          title={t("purchased_waiting_import")}
          value={purchasedCount}
          gradient="bg-gradient-to-r from-teal-500 to-teal-600"
          tabId="purchased"
        />
        <CombinedStatCard
          IconComponent={Package}
          title1={t("total_inventory")}
          value1={totalInventory}
          title2={t("available")}
          value2={availableDevices}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          tabId="inventory"
        />
        <StatCard
          IconComponent={LogOut}
          title={t("in_use")}
          value={inUseDevices}
          gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
          tabId="allocated"
        />
        <StatCard
          IconComponent={Wrench}
          title={t("in_maintenance")}
          value={maintenanceCount}
          gradient="bg-gradient-to-r from-orange-500 to-orange-600"
          tabId="maintenance"
        />
        <StatCard
          IconComponent={Trash2}
          title={t("pending_liquidation")}
          value={liquidationCount}
          gradient="bg-gradient-to-r from-slate-500 to-slate-600"
          tabId="liquidation"
        />
        <StatCard
          IconComponent={FileText}
          title={t("reports")}
          value={reportsCount}
          gradient="bg-gradient-to-r from-pink-500 to-pink-600"
          tabId="reports"
        />
      </div>
    </div>
  );
};

export default DashboardView;
