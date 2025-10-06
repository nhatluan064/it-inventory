import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  LogIn,
  CheckCircle,
  Package,
  ChevronDown,
  ChevronRight,
  Inbox,
} from "lucide-react";
import EmptyState from "../components/EmptyState";
import { useSort } from "../hooks/useSort";

const PurchasedView = ({ items, onImportItem, categories, t }) => {
  const [importingIds, setImportingIds] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState({});
  const [expandedRows, setExpandedRows] = useState({});

  const { items: sortedItems } = useSort(items || [], {
    key: "name",
    direction: "ascending",
  });

  const groupedByCategory = useMemo(() => {
    return (sortedItems || []).reduce((acc, item) => {
      const key = item.category || "uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [sortedItems]);

  const handleSnChange = (id, value) => {
    setSerialNumbers((prev) => ({ ...prev, [id]: value }));
  };

  const handleImportClick = async (item) => {
    const sns = (serialNumbers[item.id] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (sns.length !== item.purchaseQuantity) {
      toast.error(
        t("toast_sn_quantity_mismatch", {
          snCount: sns.length,
          purchaseCount: item.purchaseQuantity,
        })
      );
      return;
    }
    const uniqueSns = new Set(sns.map((s) => s.toLowerCase()));
    if (uniqueSns.size !== sns.length) {
      toast.error(t("toast_duplicate_sn_error"));
      return;
    }
    setImportingIds((prev) => [...prev, item.id]);
    try {
      await onImportItem(item, sns);
    } finally {
      setImportingIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const toggleExpand = (name) =>
    setExpandedRows((prev) => ({ [name]: !prev[name] }));

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 bg-clip-text text-transparent">
          {t("purchased_list")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("purchased_desc")}
        </p>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp p-6">
        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-3">
          {Object.keys(groupedByCategory).length === 0 && (
            <EmptyState
              icon={Inbox}
              title={t("empty_purchased_title")}
              description={t("empty_purchased_text")}
            />
          )}
          {Object.entries(groupedByCategory).map(
            ([categoryId, items], catIndex) => {
              const isExpanded = expandedRows[categoryId];
              const sortedSubItems = [...items].sort((a, b) => {
                const aValue = a.name || "";
                const bValue = b.name || "";
                const collator = new Intl.Collator(undefined, {
                  numeric: true,
                  sensitivity: "base",
                });
                return collator.compare(aValue.toString(), bValue.toString());
              });

              return (
                <div
                  key={categoryId}
                  className="border-2 border-teal-200 dark:border-teal-700 rounded-lg overflow-hidden animate-fadeIn"
                  style={{ animationDelay: `${catIndex * 0.05}s` }}
                >
                  <div
                    onClick={() => toggleExpand(categoryId)}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 hover:from-teal-100 hover:to-emerald-100 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-white" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        {/* show category name when available */}
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {(categories || []).find((c) => c.id === categoryId)
                            ?.name || categoryId}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {items.length} {t("label_devices")}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-teal-600 dark:text-teal-400">
                      {isExpanded ? t("collapse") : t("expand")}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                      {sortedSubItems.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-slideInLeft border-l-4 border-transparent hover:border-teal-300"
                          style={{ animationDelay: `${itemIndex * 0.03}s` }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-2 h-2 bg-teal-400 dark:bg-teal-500 rounded-full flex-shrink-0"></div>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-emerald-400 dark:from-teal-500 dark:to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                                <Package className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-gray-900 dark:text-white">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {t("serial_number_sn")}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <input
                              type="text"
                              value={serialNumbers[item.id] || ""}
                              onChange={(e) =>
                                handleSnChange(item.id, e.target.value)
                              }
                              placeholder={t("add_multiple_sn_placeholder")}
                              className="w-40 text-xs p-2 border-2 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                            />
                            <button
                              onClick={() => handleImportClick(item)}
                              disabled={importingIds.includes(item.id)}
                              title={t("import_to_inventory")}
                              className="p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center bg-teal-100 text-teal-600 hover:bg-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:hover:bg-teal-900"
                            >
                              {importingIds.includes(item.id) ? (
                                <CheckCircle className="w-5 h-5 animate-pulse" />
                              ) : (
                                <LogIn className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
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

export default PurchasedView;
