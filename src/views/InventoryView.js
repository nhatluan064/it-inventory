import React, { useMemo, useState, useEffect } from "react";
import { Search, Edit, Trash2, Eye, LogOut, Plus, User } from "lucide-react";
import { useSort } from "../hooks/useSort";
import { AnimatedButton } from "../components/AnimatedButton";

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
  const [expandedRows, setExpandedRows] = useState({});
  const [animatingRows, setAnimatingRows] = useState({});
  const [subSortConfigs, setSubSortConfigs] = useState({});

  // State để quản lý sorting category riêng
  const [categorySortConfig, setCategorySortConfig] = useState({
    key: "category",
    direction: "ascending",
  });

  const { items: sortedItems } = useSort(equipment, {
    key: "name",
    direction: "ascending",
  });

  // Handler riêng cho category sort
  const handleCategorySort = () => {
    setCategorySortConfig((prev) => ({
      key: "category",
      direction: prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const groupedByCategory = useMemo(() => {
    const grouped = sortedItems.reduce((acc, item) => {
      const key = item.category || "uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    // Sắp xếp các categories theo thứ tự A-Z
    const sortedGrouped = {};
    const sortedCategoryIds = Object.keys(grouped).sort((a, b) => {
      const categoryA = categories.find((c) => c.id === a)?.name || a;
      const categoryB = categories.find((c) => c.id === b)?.name || b;

      // Sử dụng Intl.Collator với cấu hình chuẩn cho sắp xếp A-Z
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      });
      const comparison = collator.compare(categoryA, categoryB);

      // Áp dụng hướng sắp xếp từ categorySortConfig
      return categorySortConfig.direction === "ascending"
        ? comparison
        : -comparison;
    });

    sortedCategoryIds.forEach((categoryId) => {
      sortedGrouped[categoryId] = grouped[categoryId];
    });

    return sortedGrouped;
  }, [sortedItems, categories, categorySortConfig]);

  // Reset expanded rows when filters change
  useEffect(() => {
    setExpandedRows({});
    setAnimatingRows({});
  }, [filters]);

  // Reset expanded rows when category filter changes specifically
  useEffect(() => {
    setExpandedRows({});
    setAnimatingRows({});
  }, [filters.category]);

  const categoryCounts = useMemo(() => {
    if (!unfilteredEquipment) return {};
    return unfilteredEquipment.reduce((acc, item) => {
      if (item && item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
      return acc;
    }, {});
  }, [unfilteredEquipment]);

  const uniqueStatuses = useMemo(() => {
    if (!unfilteredEquipment) return [];
    return [...new Set(unfilteredEquipment.map((item) => item.status))];
  }, [unfilteredEquipment]);

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString(t("locale_string"));
  };

  const toggleExpand = (name) => {
    const isExpanded = expandedRows[name];
    if (isExpanded) {
      setAnimatingRows((prev) => ({ ...prev, [name]: "closing" }));
      setTimeout(() => {
        setExpandedRows((prev) => ({ ...prev, [name]: false }));
        setAnimatingRows((prev) => ({ ...prev, [name]: undefined }));
      }, 300);
    } else {
      setExpandedRows((prev) => ({ ...prev, [name]: true }));
      setAnimatingRows((prev) => ({ ...prev, [name]: "opening" }));
    }
  };

  const requestSubSort = (groupName, key) => {
    setSubSortConfigs((prevConfigs) => {
      const currentConfig = prevConfigs[groupName] || {};
      let direction = "ascending";
      if (
        currentConfig.key === key &&
        currentConfig.direction === "ascending"
      ) {
        direction = "descending";
      }
      return { ...prevConfigs, [groupName]: { key, direction } };
    });
  };

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">{/* Page transition */}
        <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">{/* Filter section animation */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                {t("inventory_list")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t("inventory_desc")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <AnimatedButton
                onClick={onAddLegacyItem}
                variant="primary"
                className="flex items-center space-x-2 text-sm font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>{t("import_unlisted_device")}</span>
              </AnimatedButton>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold mb-2">
                {t("search")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="search"
                  type="text"
                  placeholder={t("search_inventory_placeholder")}
                  className="w-full pl-9 pr-4 py-2 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2">
                {t("category")}
              </label>
              <select
                name="category"
                className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
                value={filters.category}
                onChange={handleFilterChange}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{`${cat.name} (${
                    cat.id === "all"
                      ? unfilteredEquipment.length
                      : (categoryCounts && categoryCounts[cat.id]) || 0
                  })`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2">
                {t("status")}
              </label>
              <select
                name="status"
                className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
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
              <label className="block text-xs font-semibold mb-2">
                {t("import_date")}
              </label>
              <input
                name="importDate"
                type="date"
                className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
                value={filters.importDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp">
          {/* Table container animation */}
          {/* Sửa đổi ở đây */}
          <div className="flex-grow overflow-y-auto hide-scrollbar">
            <table className="w-full text-xs table-fixed">
              <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th
                    className="px-4 py-3.5 text-left font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 cursor-pointer select-none"
                    onClick={handleCategorySort}
                  >
                    {t("category")}
                    {categorySortConfig.direction === "ascending" ? " ▲" : " ▼"}
                  </th>
                  <th className="px-4 py-3.5 text-right font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 w-32">
                    {t("quantity")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {Object.entries(groupedByCategory).map(
                  ([categoryId, items], categoryIndex) => {
                    const isOpening = animatingRows[categoryId] === "opening";
                    const isClosing = animatingRows[categoryId] === "closing";
                    const category = categories.find(
                      (c) => c.id === categoryId
                    );
                    const subSortConfig = subSortConfigs[categoryId] || {
                      key: "name",
                      direction: "ascending",
                    };
                    const sortedSubItems = [...items].sort((a, b) => {
                      const aValue = a[subSortConfig.key] || "";
                      const bValue = b[subSortConfig.key] || "";
                      const collator = new Intl.Collator(undefined, {
                        numeric: true,
                        sensitivity: "base",
                      });
                      const comparison = collator.compare(
                        aValue.toString(),
                        bValue.toString()
                      );
                      return subSortConfig.direction === "ascending"
                        ? comparison
                        : -comparison;
                    });
                    return (
                      <React.Fragment key={categoryId}>
                        <tr
                          className="bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer animate-fadeInUp transition-all duration-300"
                          style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                          onClick={() => toggleExpand(categoryId)}
                        >
                          <td className="px-4 py-3 font-semibold capitalize">
                            {category?.name || categoryId}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {items.length}
                          </td>
                        </tr>
                        {(expandedRows[categoryId] || isClosing) && (
                          <tr className="bg-white dark:bg-gray-800">
                            <td
                              colSpan={2}
                              className={`p-0 overflow-hidden ${
                                isOpening ? "animate-slideDown" : ""
                              } ${isClosing ? "animate-slideUp" : ""}`}
                            >
                              <div className="p-2 text-xs">
                                <div className="grid grid-cols-12 gap-x-4 items-center p-2 rounded-t-md font-bold italic text-gray-600 dark:text-gray-400">
                                  <div
                                    className="col-span-2 cursor-pointer"
                                    onClick={() =>
                                      requestSubSort(categoryId, "name")
                                    }
                                  >
                                    {t("device_name")}
                                  </div>
                                  <div
                                    className="col-span-2 cursor-pointer"
                                    onClick={() =>
                                      requestSubSort(categoryId, "serialNumber")
                                    }
                                  >
                                    SN
                                  </div>
                                  <div
                                    className="col-span-2 cursor-pointer"
                                    onClick={() =>
                                      requestSubSort(
                                        categoryId,
                                        "allocationDetails.recipientName"
                                      )
                                    }
                                  >
                                    {t("user_in_use")}
                                  </div>
                                  <div
                                    className="col-span-2 cursor-pointer"
                                    onClick={() =>
                                      requestSubSort(categoryId, "importDate")
                                    }
                                  >
                                    {t("import_date")}
                                  </div>
                                  <div
                                    className="col-span-1 cursor-pointer"
                                    onClick={() =>
                                      requestSubSort(
                                        categoryId,
                                        "allocationDetails.handoverDate"
                                      )
                                    }
                                  >
                                    {t("handover_date")}
                                  </div>
                                  <div
                                    className="col-span-1 cursor-pointer"
                                    onClick={() =>
                                      requestSubSort(categoryId, "location")
                                    }
                                  >
                                    {t("location")}
                                  </div>
                                  <div className="col-span-2 text-center">
                                    {t("actions")}
                                  </div>
                                </div>
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {sortedSubItems.map((item, itemIndex) => {
                                    const isInUse = item.status === "in-use";
                                    return (
                                      <div
                                        key={item.id}
                                        className={`grid grid-cols-12 gap-x-4 items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 animate-slideInLeft transition-all duration-300 ${
                                          isInUse
                                            ? "bg-blue-50 dark:bg-blue-900/20"
                                            : ""
                                        }`}
                                        style={{
                                          animationDelay: `${
                                            itemIndex * 0.05
                                          }s`,
                                        }}
                                      >
                                        <div
                                          className={`col-span-2 truncate font-semibold ${
                                            isInUse
                                              ? "text-blue-600 dark:text-blue-400"
                                              : ""
                                          }`}
                                        >
                                          {item.name}
                                        </div>
                                        <div className="col-span-2 truncate font-mono">
                                          {item.serialNumber || "N/A"}
                                        </div>
                                        <div className="col-span-2 truncate">
                                          {isInUse ? (
                                            <div className="flex items-center gap-2">
                                              <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                              <span className="truncate">
                                                {
                                                  item.allocationDetails
                                                    ?.recipientName
                                                }
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-gray-500 italic">
                                              {t("user_not_use")}
                                            </span>
                                          )}
                                        </div>
                                        <div className="col-span-2 truncate">
                                          {formatDate(item.importDate)}
                                        </div>
                                        <div className="col-span-1 truncate">
                                          {formatDate(
                                            item.allocationDetails?.handoverDate
                                          )}
                                        </div>
                                        <div className="col-span-1 truncate">
                                          {t(item.location) || item.location}
                                        </div>
                                        <div className="col-span-2 flex items-center justify-center">
                                          <div className="flex items-center justify-center space-x-1">
                                            <button
                                              onClick={() =>
                                                onAllocateItem(item)
                                              }
                                              disabled={
                                                item.status !== "available"
                                              }
                                              className="p-2 rounded-lg text-blue-500 hover:bg-blue-100 disabled:opacity-30 animate-hoverScale transition-all duration-200"
                                            >
                                              <LogOut className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => onViewItem(item)}
                                              className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-100 animate-hoverScale transition-all duration-200"
                                            >
                                              <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => onEditItem(item)}
                                              className="p-2 rounded-lg text-amber-500 hover:bg-amber-100 animate-hoverScale transition-all duration-200"
                                            >
                                              <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => onDeleteItem(item)}
                                              className="p-2 rounded-lg text-red-500 hover:bg-red-100 animate-hoverScale transition-all duration-200"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default InventoryView;
