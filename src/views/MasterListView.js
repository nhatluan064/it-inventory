import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, ChevronDown, ChevronRight, Package } from "lucide-react";
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
  const [animatingRows, setAnimatingRows] = useState({});
  const [subSortConfigs, setSubSortConfigs] = useState({});
  const [bulkTargets, setBulkTargets] = useState({});

  // State để quản lý sorting category riêng
  const [categorySortConfig, setCategorySortConfig] = useState({
    key: "category",
    direction: "ascending",
  });

  const { items: sortedItems } = useSort(allItems, {
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
  }, [sortedItems, categories, categorySortConfig, selectedCategory, searchQuery]);

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

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      {/* Page transition */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("search_master_item_placeholder")}
              className="w-full pl-9 pr-4 py-2 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {`${cat.name} (${
                  cat.id === "all"
                    ? allItems.length
                    : categoryCounts[cat.id] || 0
                })`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp p-6">
        {/* Card-based container */}
        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-3">
          {Object.entries(groupedByCategory).map(([categoryId, items], catIndex) => {
            const isExpanded = expandedRows[categoryId];
            const category = categories.find((c) => c.id === categoryId);
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
                        <ChevronDown className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {category?.name || categoryId}
                      </h3>
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
                          .filter((c) => c.id !== "all" && c.id !== categoryId)
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
                          e.name.split(" (User:")[0].trim() ===
                            item.name &&
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
                            <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full flex-shrink-0"></div>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Package className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {isModelInUse ? (
                                    <span className="text-green-600 dark:text-green-400 font-medium">
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
                              className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200"
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
          })}
        </div>
      </div>
    </div>
  );
};

export default MasterListView;
