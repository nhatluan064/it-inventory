// src/modals/AddFromMasterModal.js
import React, { useState, useMemo, useCallback } from "react";
import { Search, PlusCircle, X, Package, ChevronDown, ChevronRight } from "lucide-react";

const AddFromMasterModal = ({
  show,
  onClose,
  masterItems,
  onAddItem,
  pendingItems,
  categories,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});

  // Helper function to get category name
  const getCategoryName = useCallback((categoryId) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  }, [categories]);

  const filteredItems = masterItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingItemNames = pendingItems.map((item) => item.name);

  // Group items by category
  const groupedByCategory = useMemo(() => {
    const grouped = filteredItems.reduce((acc, item) => {
      const key = item.category || "uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    // Sort categories alphabetically
    const sortedGrouped = {};
    const sortedCategoryIds = Object.keys(grouped).sort((a, b) => {
      const categoryA = getCategoryName(a);
      const categoryB = getCategoryName(b);
      return categoryA.localeCompare(categoryB);
    });

    sortedCategoryIds.forEach((categoryId) => {
      sortedGrouped[categoryId] = grouped[categoryId];
    });

    return sortedGrouped;
  }, [filteredItems, getCategoryName]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden animate-slideInUp border border-gray-200 dark:border-gray-700">
        {/* Header với gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 px-6 py-5 flex justify-between items-center shadow-lg">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {t("add_to_purchase_request_from_master")}
            </h2>
            <p className="text-sm text-blue-50 dark:text-blue-100">
              {t("select_items_to_add_to_purchase_request")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/25 dark:hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder={t("search_master_item_placeholder")}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Items List - Grouped by Category */}
        <div className="flex-grow overflow-y-auto px-6 py-4 bg-white dark:bg-gray-900">
          {filteredItems.length > 0 ? (
            <div className="space-y-3">
              {Object.entries(groupedByCategory).map(([categoryId, items], catIndex) => {
                const isExpanded = expandedCategories[categoryId];
                const categoryName = getCategoryName(categoryId);
                
                return (
                  <div
                    key={categoryId}
                    className="border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden animate-fadeIn"
                    style={{ animationDelay: `${catIndex * 0.05}s` }}
                  >
                    {/* Category Header */}
                    <div
                      onClick={() => toggleCategory(categoryId)}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 rounded-lg flex items-center justify-center shadow-md">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-white" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {categoryName}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {items.length} {t("label_devices")}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {isExpanded ? t("collapse") : t("expand")}
                      </div>
                    </div>

                    {/* Category Items */}
                    {isExpanded && (
                      <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                        {items.map((item, itemIndex) => {
                          const isPending = pendingItemNames.includes(item.name);
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-slideInLeft border-l-4 border-transparent hover:border-blue-400 dark:hover:border-blue-500"
                              style={{ animationDelay: `${itemIndex * 0.03}s` }}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full flex-shrink-0"></div>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-400 dark:from-blue-500 dark:to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                                    <Package className="w-4 h-4 text-white" />
                                  </div>
                                  <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {item.name}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => onAddItem(item)}
                                disabled={isPending}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex-shrink-0 ml-4 ${
                                  isPending
                                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-2 border-gray-300 dark:border-gray-600"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                                }`}
                              >
                                <PlusCircle className="w-4 h-4" />
                                <span>{isPending ? t("requested") : t("add")}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <Search className="w-16 h-16 mb-4 opacity-20 dark:opacity-30" />
              <p className="text-lg font-medium mb-1 text-gray-700 dark:text-gray-300">{t("no_master_items_found")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("try_different_search_term")}</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-200">{filteredItems.length} {t("items_found")}</span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFromMasterModal;
