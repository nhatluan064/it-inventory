import React, { useMemo, useState, useEffect } from "react";
import { Trash2, Package, ChevronDown, ChevronRight } from "lucide-react";
import { useSort } from "../hooks/useSort";

const LiquidationView = ({ items, onLiquidateItem, categories, t }) => {
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

  useEffect(() => {
    setExpandedRows({});
  }, [items]);

  const toggleExpand = (name) => setExpandedRows((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-500 to-gray-600 bg-clip-text text-transparent">{t("liquidation_list")}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("liquidation_desc")}</p>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp p-6">
        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-3">
          {Object.entries(groupedByCategory).map(([categoryId, items], catIndex) => {
            const isExpanded = expandedRows[categoryId];
            const category = (categories || []).find((c) => c.id === categoryId);

            return (
              <div key={categoryId} className="border-2 border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden animate-fadeIn" style={{ animationDelay: `${catIndex * 0.05}s` }}>
                <div onClick={() => toggleExpand(categoryId)} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30 hover:from-slate-100 hover:to-gray-100 cursor-pointer transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-gray-600 dark:from-slate-400 dark:to-gray-500 rounded-lg flex items-center justify-center shadow-md">
                      {isExpanded ? (<ChevronDown className="w-5 h-5 text-white" />) : (<ChevronRight className="w-5 h-5 text-white" />)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{category?.name || categoryId}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{items.length} {t("label_devices")}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{isExpanded ? t("collapse") : t("expand")}</div>
                </div>

                {isExpanded && (
                  <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                    {items.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-slideInLeft border-l-4 border-transparent hover:border-slate-300" style={{ animationDelay: `${itemIndex * 0.03}s` }}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full flex-shrink-0"></div>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 bg-gradient-to-br from-slate-400 to-gray-400 dark:from-slate-500 dark:to-gray-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-gray-900 dark:text-white">{item.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{item.serialNumber || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button onClick={() => onLiquidateItem(item)} className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200" title={t("confirm_liquidated")}><Trash2 className="w-4 h-4"/></button>
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

export default LiquidationView;
