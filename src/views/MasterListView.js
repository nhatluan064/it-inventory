import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { useSort } from "../hooks/useSort";

const MasterListView = ({
  allItems,
  onAddType,
  onEditItem,
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
    <div className="h-full flex flex-col gap-6 animate-fadeIn">{/* Page transition */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">{/* Header animation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {t("master_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("master_list_desc")}
            </p>
          </div>
          <button
            onClick={onAddType}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold animate-hoverScale transition-all duration-200"
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
                {`${cat.name} (${cat.id === "all" ? allItems.length : categoryCounts[cat.id] || 0})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp">{/* Table container animation */}
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
              {Object.entries(groupedByCategory).map(([categoryId, items]) => {
                const isOpening = animatingRows[categoryId] === "opening";
                const isClosing = animatingRows[categoryId] === "closing";
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
                  <React.Fragment key={categoryId}>
                    <tr
                      className="bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer animate-fadeInUp transition-all duration-300"
                      style={{ animationDelay: `${Object.keys(groupedByCategory).indexOf(categoryId) * 0.1}s` }}
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
                      <tr>
                        <td
                          colSpan={2}
                          className={`p-0 overflow-hidden ${
                            isOpening ? "animate-slideDown" : ""
                          } ${isClosing ? "animate-slideUp" : ""}`}
                        >
                          <div className="p-2 text-xs">
                            <div className="grid grid-cols-12 gap-x-4 items-center p-2 rounded-t-md font-bold italic text-gray-600 dark:text-gray-400">
                              <div
                                className="col-span-6 cursor-pointer"
                                onClick={() =>
                                  requestSubSort(categoryId, "name")
                                }
                              >
                                {t("master_item_name")}
                              </div>
                              <div
                                className="col-span-4 cursor-pointer"
                                onClick={() =>
                                  requestSubSort(categoryId, "usage_status")
                                }
                              >
                                {t("usage_status")}
                              </div>
                              <div className="col-span-2 text-center">
                                {t("actions")}
                              </div>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                              {sortedSubItems.map((item, itemIndex) => {
                                const isModelInUse = fullEquipmentList.some(
                                  (e) =>
                                    e.name.split(" (User:")[0].trim() ===
                                      item.name &&
                                    e.category === item.category &&
                                    e.status !== "master"
                                );
                                const statusText = isModelInUse
                                  ? t("has_been_used")
                                  : t("never_used");
                                const statusColor = isModelInUse
                                  ? "text-green-600 dark:text-green-400 font-semibold"
                                  : "text-gray-500 dark:text-gray-400";
                                return (
                                  <div
                                    key={item.id}
                                    className="grid grid-cols-12 gap-x-4 items-center py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 animate-slideInLeft transition-all duration-300"
                                    style={{ animationDelay: `${itemIndex * 0.05}s` }}
                                  >
                                    <div className="col-span-6 truncate font-semibold flex items-center">
                                      {item.name}
                                    </div>
                                    <div
                                      className={`col-span-4 truncate ${statusColor} flex items-center`}
                                    >
                                      {statusText}
                                    </div>
                                    <div className="col-span-2 flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => onEditItem(item)}
                                        disabled={isModelInUse}
                                        className="p-2 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg disabled:opacity-40 animate-hoverScale transition-all duration-200"
                                        title={
                                          isModelInUse
                                            ? t("cannot_edit_used_model")
                                            : t("edit")
                                        }
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => onDeleteItem(item)}
                                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg animate-hoverScale transition-all duration-200"
                                        title={t("delete")}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MasterListView;
