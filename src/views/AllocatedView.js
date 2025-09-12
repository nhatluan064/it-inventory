// src/views/AllocatedView.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import { RotateCcw, Search, ChevronDown, Wrench, SlidersHorizontal, X } from "lucide-react";
import { useSort, SortableHeader } from "../hooks/useSort";

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const allColumns = useMemo(() => [
    { key: "name", label: "device_name", sortable: true },
    { key: "serialNumber", label: "serial_number_sn", sortable: true },
    { key: "allocationDetails.recipientName", label: "recipient", sortable: true },
    { key: "allocationDetails.employeeId", label: "employee_id", sortable: true },
    { key: "allocationDetails.position", label: "position", sortable: true },
    { key: "allocationDetails.department", label: "department", sortable: true },
    { key: "allocationDetails.handoverDate", label: "handover_date", sortable: true },
    { key: "actions", label: "actions", sortable: false, className: "text-center" },
  ], [t]);
  
  const [visibleColumns, setVisibleColumns] = useState(new Set(allColumns.map(c => c.key)));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    items: sortedItems,
    requestSort,
    sortConfig,
  } = useSort(items, {
    key: "allocationDetails.handoverDate",
    direction: "descending",
  });

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) newSet.delete(columnKey);
      else newSet.add(columnKey);
      return newSet;
    });
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const columnsToRender = allColumns.filter(c => visibleColumns.has(c.key));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const categoryCounts = (
    Array.isArray(unfilteredAllocatedItems) ? unfilteredAllocatedItems : []
  ).reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t("allocated_list")}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("allocated_desc")}</p>
            </div>
            <div className="md:hidden">
                 <button
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                >
                    {isMobileFilterOpen ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
                </button>
            </div>
        </div>
        <div className={`
            flex-col md:flex-row gap-4
            ${isMobileFilterOpen ? 'flex' : 'hidden md:flex'}
        `}>
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="search"
              placeholder="Tìm theo tên thiết bị, SN, người nhận..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <select
            name="category"
            className="w-full md:w-auto py-2 px-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            value={filters.category}
            onChange={handleFilterChange}
          >
            {categories.map((cat) => {
              const count =
                cat.id === "all"
                  ? (unfilteredAllocatedItems || []).length
                  : categoryCounts[cat.id] || 0;
              const displayName = `${cat.name} (${count})`;
              return (
                <option key={cat.id} value={cat.id}>{displayName}</option>
              );
            })}
          </select>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="w-full md:w-auto flex items-center justify-between px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
            >
              <span>Tùy chọn hiển thị</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border dark:border-gray-700">
                <div className="p-4 grid grid-cols-2 gap-2">
                  {allColumns.map(col => (
                    col.key !== 'actions' && (
                      <label key={col.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={visibleColumns.has(col.key)}
                          onChange={() => handleColumnToggle(col.key)}
                        />
                        <span className="text-sm">{t(col.label)}</span>
                      </label>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
                    <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      {visibleColumns.has('name') && <td className="px-6 py-4 font-medium">{item.name.split(" (User:")[0]}</td>}
                      {visibleColumns.has('serialNumber') && <td className="px-6 py-4 font-mono">{item.serialNumber || "N/A"}</td>}
                      {visibleColumns.has('allocationDetails.recipientName') && <td className="px-6 py-4">{details.recipientName || "N/A"}</td>}
                      {visibleColumns.has('allocationDetails.employeeId') && <td className="px-6 py-4">{details.employeeId || "N/A"}</td>}
                      {visibleColumns.has('allocationDetails.position') && <td className="px-6 py-4">{renderPosition(details)}</td>}
                      {visibleColumns.has('allocationDetails.department') && <td className="px-6 py-4">{details.department ? t(details.department) : "N/A"}</td>}
                      {visibleColumns.has('allocationDetails.handoverDate') && <td className="px-6 py-4">{formatDate(details.handoverDate)}</td>}
                      {visibleColumns.has('actions') && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={() => onRecallItem(item)} className="p-2" title={t("recall_device")}><RotateCcw className="w-5 h-5 text-green-600 hover:text-green-400" /></button>
                            <button onClick={() => onMarkDamaged(item)} className="p-2" title={t("maintenance")}><Wrench className="w-5 h-5 text-orange-500 hover:text-orange-400" /></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columnsToRender.length} className="text-center py-12">
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
