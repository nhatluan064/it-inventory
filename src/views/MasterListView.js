import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSort } from "../hooks/useSort";

const MasterListView = ({
  allItems,
  onAddType,
  onEditItem,
  onBulkMoveCategory,
  onDeleteItem,
  categories,
  t,
  fullEquipmentList,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});
  const [, setAnimatingRows] = useState({});
  const [subSortConfigs, setSubSortConfigs] = useState({});
  // Handler để đảo chiều sort cho từng nhóm category
  const handleSubSortToggle = (categoryId) => {
    setSubSortConfigs((prev) => {
      const prevConfig = prev[categoryId] || { key: "name", direction: "ascending" };
      return {
        ...prev,
        [categoryId]: {
          ...prevConfig,
          direction: prevConfig.direction === "ascending" ? "descending" : "ascending",
        },
      };
    });
  };
  const [bulkTargets, setBulkTargets] = useState({});

  // State để quản lý sorting category riêng
  const [categorySortConfig] = useState({
    key: "category",
    direction: "ascending",
  });

  const { items: sortedItems } = useSort(allItems, {
    key: "name",
    direction: "ascending",
  });

  // Category sort config can be toggled by future UI controls; function removed to keep build clean

  const categoryCounts = useMemo(() => {
    if (!allItems) return {};
    return allItems.reduce((acc, item) => {
      if (item && item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
      return acc;
    }, {});
  }, [allItems]);

  const categoryOptions = useMemo(() => {
    const allOption = { id: "all", name: t("all") };
    return [allOption, ...categories];
  }, [categories, t]);

  const groupedByCategory = useMemo(() => {
    let itemsToGroup = sortedItems;
    if (selectedCategory !== "all") {
      itemsToGroup = itemsToGroup.filter(
        (item) => item.category === selectedCategory
      );
    }
    if (searchQuery) {
      itemsToGroup = itemsToGroup.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const grouped = itemsToGroup.reduce((acc, item) => {
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
  }, [
    sortedItems,
    categories,
    categorySortConfig,
    selectedCategory,
    searchQuery,
  ]);

  // Reset expanded rows when category filter changes
  useEffect(() => {
    setExpandedRows({});
    setAnimatingRows({});
  }, [selectedCategory]);

  const toggleExpand = (name) => {
    const isExpanded = expandedRows[name];
    if (isExpanded) {
      setAnimatingRows((prev) => ({ ...prev, [name]: "closing" }));
      setTimeout(() => {
        setExpandedRows((prev) => ({ ...prev, [name]: false }));
        setAnimatingRows((prev) => ({ ...prev, [name]: undefined }));
      }, 300);
    } else {
      // Only keep clicked open
      setExpandedRows({ [name]: true });
      setAnimatingRows((prev) => ({ ...prev, [name]: "opening" }));
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      {/* Page transition / Header */}
      <div className="card card-lg glass-effect animate-slideInDown">
        {/* Header animation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
              {t("master_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("master_list_desc")}
            </p>
          </div>
          <button
            onClick={onAddType}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold animate-hoverScale transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>{t("add_new_master_item")}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end text-xs">
          <div className="relative group w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder={t("search_master_item_placeholder")}
              className="w-full pl-7 pr-2 py-1 border rounded text-xs dark:bg-gray-700/50 dark:border-gray-600 h-7"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full py-1 px-2 border rounded text-xs dark:bg-gray-700/50 dark:border-gray-600 h-7"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            ...
          </select>
        </div>
      </div>

      <div className="flex-grow flex flex-col card animate-slideInUp card-lg overflow-hidden">
        {/* Card-based container */}
        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-3">
          {Object.entries(groupedByCategory).map(
            ([categoryId, items], catIndex) => {
              const isExpanded = expandedRows[categoryId];
              const category = categories.find((c) => c.id === categoryId);
              const subSortConfig = subSortConfigs[categoryId] || {
                key: "name",
                direction: "ascending",
              };
              // Sort tự nhiên theo tên, nếu trùng thì sort theo số cuối SN
              const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
              const sortedSubItems = [...items].sort((a, b) => {
                const aName = a.name || "";
                const bName = b.name || "";
                const nameCompare = collator.compare(aName, bName);
                if (nameCompare !== 0) {
                  return subSortConfig.direction === "ascending" ? nameCompare : -nameCompare;
                }
                // Nếu tên giống nhau, sort theo số cuối của serialNumber
                const getLastNumber = (sn) => {
                  if (!sn) return -1;
                  const match = sn.match(/(\d+)(?!.*\d)/);
                  return match ? parseInt(match[1], 10) : -1;
                };
                const aSN = getLastNumber(a.serialNumber);
                const bSN = getLastNumber(b.serialNumber);
                if (aSN === bSN) return 0;
                return subSortConfig.direction === "ascending" ? aSN - bSN : bSN - aSN;
              });

              return (
                <div
                  key={categoryId}
                  className="border-2 border-cyan-200 dark:border-cyan-700 rounded-lg overflow-hidden animate-fadeIn"
                  style={{ animationDelay: `${catIndex * 0.05}s` }}
                >
                  {/* Category Header with Green Gradient */}
                  <div
                    onClick={() => toggleExpand(categoryId)}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/30 dark:to-sky-900/30 hover:from-cyan-100 hover:to-sky-100 dark:hover:from-cyan-800/40 dark:hover:to-sky-800/40 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-400 dark:to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-white" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {category?.name || categoryId}
                        </h3>
                        {/* Button sort tên thiết bị A-Z/Z-A */}
                        <button
                          type="button"
                          className="ml-1 p-1 rounded hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition"
                          title={subSortConfig.direction === "ascending" ? "Sắp xếp A-Z" : "Sắp xếp Z-A"}
                          onClick={e => {
                            e.stopPropagation();
                            handleSubSortToggle(categoryId);
                          }}
                        >
                          {subSortConfig.direction === "ascending" ? (
                            <ArrowDown className="w-3.5 h-3.5 text-cyan-500" />
                          ) : (
                            <ArrowUp className="w-3.5 h-3.5 text-cyan-500" />
                          )}
                        </button>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {items.length} {t("label_masters")} |{" "}
                          {(() => {
                            const all = (fullEquipmentList || []).filter(
                              (it) => it.category === categoryId
                            );
                            const d = all.filter(
                              (it) => it.status !== "master"
                            ).length;
                            return `${d} ${t("label_devices")}`;
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Bulk Move Section */}
                      <div
                        className="flex items-center gap-2 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("move_to")}:
                        </span>
                        <select
                          className="px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                          value={bulkTargets[categoryId] ?? ""}
                          onChange={(e) => {
                            setBulkTargets((prev) => ({
                              ...prev,
                              [categoryId]: e.target.value,
                            }));
                          }}
                        >
                          <option value="" disabled>
                            {t("select_target_category")}
                          </option>
                          {(categories || [])
                            .filter(
                              (c) => c.id !== "all" && c.id !== categoryId
                            )
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                        <button
                          className="px-2 py-1 text-xs rounded border border-cyan-300 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-300 dark:hover:bg-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={
                            !bulkTargets[categoryId] ||
                            bulkTargets[categoryId] === categoryId
                          }
                          onClick={() => {
                            const toCategoryId = bulkTargets[categoryId];
                            if (toCategoryId === categoryId) return;
                            const allAffected = (
                              fullEquipmentList || []
                            ).filter((it) => it.category === categoryId);
                            const deviceCount = allAffected.filter(
                              (it) => it.status !== "master"
                            ).length;
                            const masterCount =
                              allAffected.length - deviceCount;
                            const affectedCount = allAffected.length;
                            const fromName =
                              (categories || []).find(
                                (c) => c.id === categoryId
                              )?.name || categoryId;
                            const toName =
                              (categories || []).find(
                                (c) => c.id === toCategoryId
                              )?.name || toCategoryId;
                            // eslint-disable-next-line no-alert
                            const ok = window.confirm(
                              `${t("confirm_bulk_move_category_breakdown", {
                                deviceCount,
                                masterCount,
                                from: fromName,
                                to: toName,
                              })}\n(${t("confirm_bulk_move_category", {
                                count: affectedCount,
                                from: fromName,
                                to: toName,
                              })})`
                            );
                            if (!ok) return;
                            onBulkMoveCategory?.({
                              fromCategoryId: categoryId,
                              toCategoryId,
                            })
                              .then((res) => {
                                if (res) {
                                  toast.success(
                                    t("toast_bulk_move_category_success", {
                                      count: affectedCount,
                                      from: fromName,
                                      to: toName,
                                    })
                                  );
                                  setBulkTargets((prev) => ({
                                    ...prev,
                                    [categoryId]: "",
                                  }));
                                }
                              })
                              .catch((err) => {
                                console.error(err);
                                toast.error(
                                  t("toast_bulk_move_category_error")
                                );
                              });
                          }}
                        >
                          {t("confirm")}
                        </button>
                      </div>
                      <div className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                        {isExpanded ? t("collapse") : t("expand")}
                      </div>
                    </div>
                  </div>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                      {sortedSubItems.map((item, itemIndex) => {
                        const isModelInUse = fullEquipmentList.some(
                          (e) =>
                            e.name.split(" (User:")[0].trim() === item.name &&
                            e.category === item.category &&
                            e.status !== "master"
                        );

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-slideInLeft border-l-4 border-transparent hover:border-cyan-400 dark:hover:border-cyan-500"
                            style={{
                              animationDelay: `${itemIndex * 0.03}s`,
                            }}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-2 h-2 bg-cyan-400 dark:bg-cyan-500 rounded-full flex-shrink-0"></div>
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Package className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {isModelInUse ? (
                                      <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                                        {t("has_been_used")}
                                      </span>
                                    ) : (
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {t("never_used")}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => onEditItem(item)}
                                className="p-2 text-cyan-500 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 rounded-lg transition-all duration-200"
                                title={t("edit")}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteItem(item)}
                                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                                title={t("delete")}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterListView;
