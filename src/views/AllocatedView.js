// src/views/AllocatedView.js
import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Search,
  Wrench,
  Filter,
  X,
  Layers,
  User,
  Hash,
  Calendar,
  MapPin,
} from "lucide-react";
import { useSort, SortableHeader } from "../hooks/useSort";
import { departments } from "../constants";

const AllocatedView = ({
  items,
  unfilteredAllocatedItems,
  onRecallItem,
  onMarkDamaged,
  categories,
  filters,
  setFilters,
  t,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allColumns = useMemo(
    () => [
      {
        key: "name",
        label: "device_name",
        sortable: true,
        className: "min-w-[150px]",
      },
      {
        key: "category",
        label: "category",
        sortable: true,
        className: "min-w-[120px]",
      },
      {
        key: "serialNumber",
        label: "serial_number_sn",
        sortable: true,
        className: "min-w-[130px]",
      },
      {
        key: "allocationDetails.recipientName",
        label: "recipient",
        sortable: true,
        className: "min-w-[150px]",
      },
      {
        key: "allocationDetails.employeeId",
        label: "employee_id",
        sortable: true,
        className: "min-w-[100px]",
      },
      {
        key: "allocationDetails.position",
        label: "position",
        sortable: true,
        className: "min-w-[120px]",
      },
      {
        key: "allocationDetails.department",
        label: "department",
        sortable: true,
        className: "min-w-[120px]",
      },
      {
        key: "allocationDetails.handoverDate",
        label: "handover_date",
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

  const {
    items: sortedItems,
    requestSort,
    sortConfig,
  } = useSort(items, {
    key: "allocationDetails.handoverDate",
    direction: "descending",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(t("locale_string"), {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const renderPosition = (details) => {
    let positionDisplay = details.position ? t(details.position) : "N/A";
    if (details.positionDescription) {
      positionDisplay += ` - ${details.positionDescription}`;
    }
    return positionDisplay;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const categoryCounts = useMemo(
    () =>
      (Array.isArray(unfilteredAllocatedItems)
        ? unfilteredAllocatedItems
        : []
      ).reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {}),
    [unfilteredAllocatedItems]
  );

  const departmentOptions = useMemo(
    () => [{ id: "all", tKey: "all" }, ...departments],
    []
  );

  return (
    <div className="space-y-6">
      {/* --- FILTER SECTION --- */}
      <div className="glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              {t("allocated_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("allocated_desc")}
            </p>
            <div className="h-0.5 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 mt-2 rounded-full" />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300"
          >
            {isFilterOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Filter className="w-5 h-5" />
            )}
          </button>
        </div>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end ${
            isFilterOpen ? "grid" : "hidden md:grid"
          }`}
        >
          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("search")}
            </label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="search"
                type="text"
                placeholder={t("search_inventory_placeholder")}
                className="w-full pl-10 pr-4 py-2.5 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500"
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
              className="w-full py-2.5 px-3 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{`${cat.name} (${
                  cat.id === "all"
                    ? (unfilteredAllocatedItems || []).length
                    : categoryCounts[cat.id] || 0
                })`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("department")}
            </label>
            <select
              name="department"
              className="w-full py-2.5 px-3 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              value={filters.department}
              onChange={handleFilterChange}
            >
              {departmentOptions.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {t(dept.tKey)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("handover_date")}
            </label>
            <input
              name="handoverDate"
              type="date"
              className="w-full py-2.5 px-3 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600"
              value={filters.handoverDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hidden md:block border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-xs table-fixed">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
              <SortableHeader
                columns={allColumns}
                requestSort={requestSort}
                sortConfig={sortConfig}
                t={t}
              />
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedItems.length > 0 ? (
                sortedItems.map((item, index) => {
                  const details = item.allocationDetails || {};
                  return (
                    <tr
                      key={item.id}
                      className={`h-16 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        index % 2 === 0
                          ? "bg-gray-50/30 dark:bg-gray-900/20"
                          : ""
                      }`}
                    >
                      <td className="text-center px-4 py-3.5 font-semibold align-middle">
                        {item.name.split(" (User:")[0]}
                      </td>
                      <td className="text-center px-4 py-3.5 capitalize align-middle">
                        {(categories.find((c) => c.id === item.category) || {})
                          .name || item.category}
                      </td>
                      <td className="text-center px-4 py-3.5 font-mono align-middle">
                        {item.serialNumber || "N/A"}
                      </td>
                      <td className="text-center text-center px-4 py-3.5 align-middle">
                        {details.recipientName || "N/A"}
                      </td>
                      <td className="text-center px-4 py-3.5 align-middle">
                        {details.employeeId || "N/A"}
                      </td>
                      <td className="text-center px-4 py-3.5 align-middle">
                        {renderPosition(details)}
                      </td>
                      <td className="text-center px-4 py-3.5 align-middle">
                        {details.department ? t(details.department) : "N/A"}
                      </td>
                      <td className="text-center px-4 py-3.5 align-middle">
                        {formatDate(details.handoverDate)}
                      </td>
                      <td className="text-center px-4 py-3.5 text-center align-middle">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onRecallItem(item)}
                            className="p-2 rounded-lg text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30"
                            title={t("recall_device")}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onMarkDamaged(item)}
                            className="p-2 rounded-lg text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                            title={t("maintenance")}
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={allColumns.length}
                    className="text-center py-16 text-sm"
                  >
                    {t("no_allocated_items_match_filter")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden space-y-4">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => {
            const details = item.allocationDetails || {};
            return (
              <div
                key={item.id}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">
                      {item.name.split(" (User:")[0]}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Hash className="w-3 h-3" />
                      <span className="font-mono">
                        {item.serialNumber || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 -mt-2 -mr-2">
                    <button
                      onClick={() => onRecallItem(item)}
                      className="p-2 rounded-xl text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30"
                      title={t("recall_device")}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMarkDamaged(item)}
                      className="p-2 rounded-xl text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                      title={t("maintenance")}
                    >
                      <Wrench className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t dark:border-gray-700 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {details.department ? t(details.department) : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {details.recipientName} ({details.employeeId})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatDate(details.handoverDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <p>{t("no_allocated_items_match_filter")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocatedView;
