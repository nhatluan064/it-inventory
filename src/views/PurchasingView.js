import React, { useState, useMemo } from "react";
import { CheckCircle, XCircle, Package, ChevronDown, ChevronRight } from "lucide-react";
import { useSort } from "../hooks/useSort";

const PurchasingView = ({ items, onUpdateStatus, onCancel, categories, t }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const { items: sortedItems } = useSort(items || [], { key: "name", direction: "ascending" });

  const groupedByCategory = useMemo(() => {
    return (sortedItems || []).reduce((acc, item) => {
      const key = item.category || "uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [sortedItems]);

  const toggleExpand = (name) => {
    setExpandedRows((prev) => ({ [name]: !prev[name] }));
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "0";
    return new Intl.NumberFormat(t("locale_string")).format(amount);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">{t("purchasing_list")}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("purchasing_desc")}</p>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp p-6">
        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-3">
          {Object.entries(groupedByCategory).map(([categoryId, items], catIndex) => {
            const isExpanded = expandedRows[categoryId];
            const subSortConfig = { key: "name", direction: "ascending" };
            const sortedSubItems = [...items].sort((a, b) => {
              const aValue = a[subSortConfig.key] || "";
              const bValue = b[subSortConfig.key] || "";
              const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
              const comparison = collator.compare(aValue.toString(), bValue.toString());
              return subSortConfig.direction === "ascending" ? comparison : -comparison;
            });

            return (
              <div key={categoryId} className="border-2 border-purple-200 dark:border-purple-700 rounded-lg overflow-hidden animate-fadeIn" style={{ animationDelay: `${catIndex * 0.05}s` }}>
                <div onClick={() => toggleExpand(categoryId)} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-100 hover:to-pink-100 cursor-pointer transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
                    </div>
                            <div>
                              {/* show category name when available */}
                              <h3 className="font-bold text-gray-900 dark:text-white">{(categories || []).find((c) => c.id === categoryId)?.name || categoryId}</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{items.length} {t("label_devices")}</p>
                            </div>
                  </div>
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">{isExpanded ? t("collapse") : t("expand")}</div>
                </div>

                {isExpanded && (
                  <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                    {sortedSubItems.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-slideInLeft border-l-4 border-transparent hover:border-purple-300" style={{ animationDelay: `${itemIndex * 0.03}s` }}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-2 h-2 bg-purple-400 dark:bg-purple-500 rounded-full flex-shrink-0"></div>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-gray-900 dark:text-white">{item.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{t("purchase_quantity")}: {item.purchaseQuantity}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <div className="text-xs font-mono">{formatCurrency(item.price)}</div>
                          <button onClick={() => onUpdateStatus([item.id])} className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200" title={t("confirm_purchased_count", { count: 1 })}><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => onCancel("cancel-purchasing", item)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200" title={t("cancel_purchase")}><XCircle className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
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

export default PurchasingView;
