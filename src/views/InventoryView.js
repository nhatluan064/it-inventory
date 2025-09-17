// src/views/InventoryView.js
import React, { useMemo, useState, useCallback } from "react";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Plus,
  SlidersHorizontal,
  X,
  User,
  CirclePlus,
  Package,
  Calendar,
  Hash,
  MapPin,
  Layers,
} from "lucide-react";
import { useSort, SortableHeader } from "../hooks/useSort";

const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
  .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
  .shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
  .glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.7);
  }
  .dark .glass-effect {
    background: rgba(31, 41, 55, 0.7);
  }
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .status-glow {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .status-glow::before {
    content: '';
    position: absolute;
    width: 105%;
    height: 120%;
    border-radius: 9999px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .status-glow:hover::before {
    opacity: 0.5;
    animation: pulse 2s ease-in-out infinite;
  }
  .status-glow.available::before { background: #10b981; }
  .status-glow.in-use::before { background: #3b82f6; }
  .status-glow.maintenance::before { background: #f59e0b; }
  .status-glow.damaged::before { background: #ef4444; }
  .status-glow.liquidation::before { background: #9ca3af; }
`;

const InventoryView = ({
  equipment,
  unfilteredEquipment,
  categories,
  statusLabels,
  filters,
  setFilters,
  onEditItem,
  onDeleteItem,
  onViewItem,
  onAllocateItem,
  onAddLegacyItem,
  t,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedSerials, setSelectedSerials] = useState({});

  const renderCondition = useCallback(
    (item) => {
      if (!item.condition) return "---";
      if (typeof item.condition === "object" && item.condition.key) {
        const finalParams = { ...item.condition.params };
        if (finalParams.note && typeof finalParams.note === "object") {
          const noteObject = finalParams.note;
          finalParams.note = noteObject.isKey
            ? t(noteObject.value)
            : noteObject.value;
        }
        return t(item.condition.key, finalParams);
      }
      const conditionText = t(String(item.condition));
      return item.isRecalled
        ? t("recalled_prefix", { conditionText })
        : conditionText;
    },
    [t]
  );

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "N/A";
    return new Intl.NumberFormat(t("locale_string"), {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(t("locale_string"), {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupedEquipment = useMemo(() => {
    const equipmentToGroup = equipment.filter(
      (item) => item.status === "available"
    );
    const otherEquipment = equipment.filter(
      (item) => item.status !== "available"
    );
    const equipmentMap = new Map();

    equipmentToGroup.forEach((item) => {
      const key = `${item.name}|${item.category}|${
        item.status
      }|${JSON.stringify(item.condition)}|${item.price}|${item.location}`;
      if (!equipmentMap.has(key)) {
        equipmentMap.set(key, {
          ...item,
          groupKey: key,
          groupedQuantity: 0,
          serialNumbers: [],
          originalItems: [],
        });
      }
      const group = equipmentMap.get(key);
      group.groupedQuantity += 1;
      group.serialNumbers.push(item.serialNumber);
      group.originalItems.push(item);
    });

    return [
      ...Array.from(equipmentMap.values()),
      ...otherEquipment.map((item) => ({
        ...item,
        groupKey: item.id,
        groupedQuantity: 1,
        serialNumbers: [item.serialNumber],
        originalItems: [item],
      })),
    ];
  }, [equipment]);

  const equipmentWithSortableCondition = useMemo(
    () =>
      groupedEquipment.map((item) => ({
        ...item,
        conditionText: renderCondition(item),
        "allocationDetails.recipientName":
          item.originalItems[0]?.allocationDetails?.recipientName,
      })),
    [groupedEquipment, renderCondition]
  );

  const {
    items: sortedEquipment,
    requestSort,
    sortConfig,
  } = useSort(equipmentWithSortableCondition, {
    key: "importDate",
    direction: "descending",
  });

  const handleSerialSelect = (groupKey, selectedSN) => {
    setSelectedSerials((prev) => ({ ...prev, [groupKey]: selectedSN }));
  };

  const handleAction = useCallback(
    async (action, item) => {
      const actionKey = `${action}-${item.id}`;
      setLoadingStates((prev) => ({ ...prev, [actionKey]: true }));
      try {
        if (action === "allocate") await onAllocateItem(item);
        else if (action === "view") await onViewItem(item);
        else if (action === "edit") await onEditItem(item);
        else if (action === "delete") await onDeleteItem(item);
      } finally {
        setTimeout(() => {
          setLoadingStates((prev) => ({ ...prev, [actionKey]: false }));
        }, 300);
      }
    },
    [onAllocateItem, onViewItem, onEditItem, onDeleteItem]
  );

  const handleAllocateClick = useCallback(
    (group) => {
      let itemToAllocate;
      if (group.groupedQuantity === 1) {
        itemToAllocate = group.originalItems[0];
      } else {
        const selectedSN =
          selectedSerials[group.groupKey] || group.serialNumbers[0];
        itemToAllocate = group.originalItems.find(
          (item) => item.serialNumber === selectedSN
        );
      }
      if (itemToAllocate) {
        handleAction("allocate", itemToAllocate);
      }
    },
    [selectedSerials, handleAction]
  );

  const columns = useMemo(
    () => [
      {
        key: "importDate",
        label: "import_date",
        sortable: true,
        className: "min-w-[100px] w-1/8",
      },
      {
        key: "name",
        label: "device_name",
        sortable: true,
        className: "min-w-[150px] w-1/8",
      },
      {
        key: "serialNumber",
        label: "serial_number_sn",
        sortable: true,
        className: "min-w-[150px] w-1/8",
      },
      {
        key: "category",
        label: "category",
        sortable: true,
        className: "min-w-[180px] w-1/8",
      },
      {
        key: "status",
        label: "status",
        sortable: true,
        className: "text-center min-w-[150px] w-1/8",
      },
      {
        key: "allocationDetails.recipientName",
        label: "user_in_use",
        sortable: true,
        className: "min-w-[200px]",
      },
      {
        key: "conditionText",
        label: "condition",
        sortable: true,
        className: "min-w-[150px]",
      },
      {
        key: "price",
        label: "price",
        sortable: true,
        className: "text-right min-w-[50px]",
      },
      {
        key: "groupedQuantity",
        label: "purchase_quantity",
        sortable: true,
        className: "text-center min-w-[50px]",
      },
      {
        key: "location",
        label: "location",
        sortable: true,
        className: "min-w-[120px]",
      },
      {
        key: "actions",
        label: "actions",
        sortable: false,
        className: "text-center min-w-[100px]",
      },
    ],
    [t]
  );

  const categoryCounts = useMemo(
    () =>
      (Array.isArray(unfilteredEquipment) ? unfilteredEquipment : []).reduce(
        (acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        },
        {}
      ),
    [unfilteredEquipment]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(unfilteredEquipment.map((item) => item.status))],
    [unfilteredEquipment]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusStyle = (status) => {
    const styles = {
      available:
        "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-500/25",
      "in-use":
        "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-blue-500/25",
      maintenance:
        "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-yellow-500/25",
      damaged:
        "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-red-500/25",
    };
    return (
      styles[status] || "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    );
  };

  return (
    <div className="animate-scaleIn">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {t("inventory_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("inventory_desc")}
            </p>
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-blue-600 mt-2 rounded-full" />
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={onAddLegacyItem}
              className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
              title={t("import_unlisted_device")}
            >
              <span className="absolute inset-0 shimmer"></span>
              <CirclePlus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:shadow-md transition-all duration-200"
            >
              {isMobileFilterOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <SlidersHorizontal className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div
          className={`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end ${
            isMobileFilterOpen ? "grid" : "hidden md:grid"
          }`}
        >
          <div className="sm:col-span-2 lg:col-span-4 xl:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("search")}
            </label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                name="search"
                type="text"
                placeholder={t("search_inventory_placeholder")}
                className="w-full pl-10 pr-4 py-2.5 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("category")}
            </label>
            <select
              name="category"
              className="w-full py-2.5 px-3 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{`${cat.name} (${
                  cat.id === "all"
                    ? unfilteredEquipment.length
                    : categoryCounts[cat.id] || 0
                })`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("status")}
            </label>
            <select
              name="status"
              className="w-full py-2.5 px-3 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">{t("all")}</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status] || status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("import_date")}
            </label>
            <input
              name="importDate"
              type="date"
              className="w-full py-2.5 px-3 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer"
              value={filters.importDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="hidden md:block">
            <label className="block text-xs font-medium mb-2 opacity-0">
              .
            </label>
            <button
              onClick={onAddLegacyItem}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 text-xs font-semibold"
            >
              <Plus className="w-6 h-6" />
              <span>{t("import_unlisted_device")}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hidden md:block border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="text-left w-full text-xs">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
              <SortableHeader
                columns={columns}
                requestSort={requestSort}
                sortConfig={sortConfig}
                t={t}
              />
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedEquipment && sortedEquipment.length > 0 ? (
                sortedEquipment.map((group, index) => {
                  const item = group.originalItems[0]; // For actions on non-grouped items
                  return (
                    <tr
                      key={group.groupKey}
                      className={`text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-gray-700/30 dark:hover:to-gray-700/50 ${
                        index % 2 === 0
                          ? "bg-gray-50/30 dark:bg-gray-900/20"
                          : ""
                      }`}
                      onMouseEnter={() => setHoveredRow(group.groupKey)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatDate(group.importDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {group.name}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        {group.groupedQuantity > 1 ? (
                          <select
                            className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 font-mono text-gray-600 dark:text-gray-400"
                            value={
                              selectedSerials[group.groupKey] ||
                              group.serialNumbers[0]
                            }
                            onChange={(e) =>
                              handleSerialSelect(group.groupKey, e.target.value)
                            }
                          >
                            {group.serialNumbers.map((sn) => (
                              <option key={sn} value={sn}>
                                {sn}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Hash className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-mono text-gray-600 dark:text-gray-400">
                              {group.serialNumbers[0] || "N/A"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Layers className="w-3.5 h-3.5 text-gray-500" />
                          <span className="capitalize text-gray-700 dark:text-gray-300">
                            {(
                              categories.find((c) => c.id === group.category) ||
                              {}
                            ).name || group.category}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle">
                        <div
                          className={`relative inline-block status-glow ${group.status}`}
                        >
                          <span
                            className={`relative z-10 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getStatusStyle(
                              group.status
                            )}`}
                          >
                            {statusLabels[group.status] || group.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        {group.status === "in-use" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                              {(group.allocationDetails?.recipientName || "")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {group.allocationDetails?.recipientName || ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">
                            {t("user_not_use")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <span className="text-gray-600 dark:text-gray-400">
                          {renderCondition(group)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right align-middle">
                        <div className="flex items-center justify-end gap-1">
                          <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
                            {formatCurrency(group.price)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle">
                        <span className="font-bold text-sm text-gray-700 dark:text-gray-300">
                          {group.groupedQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {t(group.location) || t("in_stock")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-middle">
                        <div
                          className={`flex items-center justify-center gap-1 transition-all duration-300 ${
                            hoveredRow === group.groupKey
                              ? "opacity-100 scale-100"
                              : "opacity-70 scale-95"
                          }`}
                        >
                          <button
                            onClick={() => handleAllocateClick(group)}
                            className={`group relative p-1.5 text-blue-500 ... ${
                              loadingStates[`allocate-${item.id}`]
                                ? "animate-pulse"
                                : ""
                            }`}
                            title={t("allocate_device")}
                            disabled={
                              group.status !== "available" ||
                              loadingStates[`allocate-${item.id}`]
                            }
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction("view", item)}
                            className={`group relative p-1.5 text-emerald-500 ... ${
                              loadingStates[`view-${item.id}`]
                                ? "animate-pulse"
                                : ""
                            }`}
                            title={t("view")}
                            disabled={loadingStates[`view-${item.id}`]}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction("edit", item)}
                            className={`group relative p-1.5 text-amber-500 ... ${
                              loadingStates[`edit-${item.id}`]
                                ? "animate-pulse"
                                : ""
                            }`}
                            title={t("edit")}
                            disabled={
                              loadingStates[`edit-${item.id}`] ||
                              group.groupedQuantity > 1
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction("delete", item)}
                            className={`group relative p-1.5 text-red-500 ... ${
                              loadingStates[`delete-${item.id}`]
                                ? "animate-pulse"
                                : ""
                            }`}
                            title={t("delete")}
                            disabled={
                              loadingStates[`delete-${item.id}`] ||
                              group.groupedQuantity > 1
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    {/*... no data ...*/}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="md:hidden space-y-4">{/*... MOBILE CARDS ...*/}</div>
    </div>
  );
};

export default InventoryView;
