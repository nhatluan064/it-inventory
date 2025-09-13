// src/views/DashboardView.js
import React, { useRef, useEffect } from "react";
import {
  Package,
  FileText,
  ClipboardList,
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

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const startDragging = (e) => {
      isDown = true;
      scrollContainer.classList.add("cursor-grabbing");
      startX = e.pageX || e.touches[0].pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const stopDragging = () => {
      isDown = false;
      scrollContainer.classList.remove("cursor-grabbing");
    };

    const whileDragging = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX || e.touches[0].pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    scrollContainer.addEventListener("mousedown", startDragging);
    scrollContainer.addEventListener("mouseleave", stopDragging);
    scrollContainer.addEventListener("mouseup", stopDragging);
    scrollContainer.addEventListener("mousemove", whileDragging);
    
    scrollContainer.addEventListener("touchstart", startDragging);
    scrollContainer.addEventListener("touchend", stopDragging);
    scrollContainer.addEventListener("touchmove", whileDragging);


    return () => {
      scrollContainer.removeEventListener("mousedown", startDragging);
      scrollContainer.removeEventListener("mouseleave", stopDragging);
      scrollContainer.removeEventListener("mouseup", stopDragging);
      scrollContainer.removeEventListener("mousemove", whileDragging);
      
      scrollContainer.removeEventListener("touchstart", startDragging);
      scrollContainer.removeEventListener("touchend", stopDragging);
      scrollContainer.removeEventListener("touchmove", whileDragging);
    };
  }, []);

  const totalInventory = equipment.filter((e) =>
    ["available", "in-use", "maintenance", "liquidation", "broken"].includes(e.status)
  ).length;
  const availableDevices = equipment.filter((e) => e.status === "available").length;
  const inUseDevices = equipment.filter((e) => e.status === "in-use").length;
  const maintenanceCount = equipment.filter((e) => e.status === "maintenance").length;
  const liquidationCount = equipment.filter((e) => e.status === "liquidation").length;

  const StatCard = ({ title, value, gradient, tabId, wide = false }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`rounded-lg p-4 text-white shadow-md ${gradient} ${
        wide ? "w-64" : "w-48"
      } flex-shrink-0 text-left transition-transform transform hover:-translate-y-1 cursor-pointer`}
    >
      <p className="text-xs opacity-90 truncate">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </button>
  );

  const CombinedStatCard = ({ title1, value1, title2, value2, gradient, tabId }) => (
     <button
      onClick={() => setActiveTab(tabId)}
      className={`rounded-lg shadow-md ${gradient} w-64 flex-shrink-0 transition-transform transform hover:-translate-y-1 cursor-pointer overflow-hidden`}
    >
        <div className="flex">
            <div className="w-1/2 p-4 text-white text-left">
                <p className="text-xs opacity-90 truncate">{title1}</p>
                <p className="text-2xl font-bold">{value1}</p>
            </div>
            <div className="border-l-4 border-white h-10 self-center"></div>
            <div className="w-1/2 p-4 text-white text-left">
                 <p className="text-xs opacity-90 truncate">{title2}</p>
                 <p className="text-2xl font-bold">{value2}</p>
            </div>
        </div>
    </button>
  );


  return (
    <div className="overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 flex space-x-4 cursor-grab hide-scrollbar"
      >
        <StatCard
            title={t("master_list")}
            value={masterListCount}
            gradient="bg-gradient-to-r from-cyan-500 to-cyan-600"
            tabId="masterList"
        />
        <StatCard
          title={t("pending_purchase_requests")}
          value={pendingPurchaseCount}
          gradient="bg-gradient-to-r from-gray-400 to-gray-500"
          tabId="pendingPurchase"
        />
        <StatCard
          title={t("in_purchasing_process")}
          value={purchasingCount}
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          tabId="purchasing"
        />
        <StatCard
          title={t("purchased_waiting_import")}
          value={purchasedCount}
          gradient="bg-gradient-to-r from-teal-500 to-teal-600"
          tabId="purchased"
        />
        <CombinedStatCard
            title1={t("total_inventory")}
            value1={totalInventory}
            title2={t("available")}
            value2={availableDevices}
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            tabId="inventory"
        />
        <StatCard
          title={t("in_use")}
          value={inUseDevices}
          gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
          tabId="allocated"
        />
        <StatCard
          title={t("in_maintenance")}
          value={maintenanceCount}
          gradient="bg-gradient-to-r from-orange-500 to-orange-600"
          tabId="maintenance"
        />
        <StatCard
          title={t("pending_liquidation")}
          value={liquidationCount}
          gradient="bg-gradient-to-r from-slate-500 to-slate-600"
          tabId="liquidation"
        />
        <StatCard
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

