// src/views/AllocatedView.js
import React, { useState, useMemo } from "react";
import { RotateCcw, Search, Wrench, Filter, X } from "lucide-react";
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
      { key: "name", label: "device_name", sortable: true },
      { key: "category", label: "category", sortable: true },
      { key: "serialNumber", label: "serial_number_sn", sortable: true },
      {
        key: "allocationDetails.recipientName",
        label: "recipient",
        sortable: true,
      },
      {
        key: "allocationDetails.employeeId",
        label: "employee_id",
        sortable: true,
      },
      { key: "allocationDetails.position", label: "position", sortable: true },
      {
        key: "allocationDetails.department",
        label: "department",
        sortable: true,
      },
      {
        key: "allocationDetails.handoverDate",
        label: "handover_date",
        sortable: true,
      },
      {
        key: "actions",
        label: "actions",
        sortable: false,
        className: "text-center",
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

  const columnsToRender = allColumns;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(t("locale_string"));
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

  const categoryCounts = (
    Array.isArray(unfilteredAllocatedItems) ? unfilteredAllocatedItems : []
  ).reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const departmentOptions = useMemo(
    () => [{ id: "all", tKey: "all" }, ...departments],
    []
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {t("allocated_list")}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("allocated_desc")}
            </p>
          </div>
          {/* Sửa: md:hidden -> lg:hidden */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md"
          >
            {isFilterOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Filter className="w-4 h-4" />
            )}
          </button>
        </div>

        <div
          className={`gap-4 ${
            isFilterOpen ? "flex flex-col" : "hidden"
          } lg:flex lg:flex-row lg:items-end`}
        >
          <div className="flex-grow">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("search")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="search"
                type="text"
                placeholder="Tìm theo tên thiết bị, SN, người nhận, MSNV..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:placeholder-gray-400 text-sm"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="flex-shrink-0 lg:w-44">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("category")}
            </label>
            <select
              name="category"
              className="w-full py-2 px-3 border rounded-lg dark:text-gray-800 text-sm"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat) => {
                const count =
                  cat.id === "all"
                    ? (unfilteredAllocatedItems || []).length
                    : categoryCounts[cat.id] || 0;
                return (
                  <option key={cat.id} value={cat.id}>
                    {`${cat.name} (${count})`}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex-shrink-0 lg:w-44">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("department")}
            </label>
            <select
              name="department"
              className="w-full py-2 px-3 border rounded-lg dark:text-gray-800 text-sm"
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
          <div className="flex-shrink-0 lg:w-44">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("handover_date")}
            </label>
            <input
              name="handoverDate"
              type="date"
              className="w-full py-2 px-3 border rounded-lg dark:text-gray-800 text-sm"
              value={filters.handoverDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <SortableHeader
              columns={columnsToRender}
              requestSort={requestSort}
              sortConfig={sortConfig}
              t={t}
            />
            <tbody className="divide-y dark:divide-gray-700">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => {
                  const details = item.allocationDetails || {};
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 font-medium">
                        {item.name.split(" (User:")[0]}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        {(categories.find((c) => c.id === item.category) || {})
                          .name || item.category}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {item.serialNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {details.recipientName || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {details.employeeId || "N/A"}
                      </td>
                      <td className="px-6 py-4">{renderPosition(details)}</td>
                      <td className="px-6 py-4">
                        {details.department ? t(details.department) : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(details.handoverDate)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onRecallItem(item)}
                            className="p-2"
                            title={t("recall_device")}
                          >
                            <RotateCcw className="w-4 h-4 text-green-600 hover:text-green-400" />
                          </button>
                          <button
                            onClick={() => onMarkDamaged(item)}
                            className="p-2"
                            title={t("maintenance")}
                          >
                            <Wrench className="w-4 h-4 text-orange-500 hover:text-orange-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columnsToRender.length}
                    className="text-center py-12"
                  >
                    {t("no_allocated_items_match_filter")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllocatedView;
