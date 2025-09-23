import React from "react";
import { CheckCircle, XCircle, Layers } from "lucide-react";
import { useSort } from "../hooks/useSort";

const PurchasingView = ({ items, onUpdateStatus, onCancel, categories, t }) => {
  const {
    items: sortedItems,
    requestSort,
    sortConfig,
  } = useSort(items, { key: "name", direction: "ascending" });

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "0";
    return new Intl.NumberFormat(t("locale_string")).format(amount);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          {t("purchasing_list")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("purchasing_desc")}
        </p>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer select-none"
                  onClick={() => requestSort("name")}
                >
                  {t("device_name")}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer select-none"
                  onClick={() => requestSort("category")}
                >
                  {t("category")}
                  {sortConfig.key === "category" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  {t("purchase_quantity")}
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  {t("price")} (VNĐ)
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="p-4 font-semibold">{item.name}</td>
                    <td className="p-4 capitalize">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-gray-500" />
                        <span>
                          {(
                            categories.find((c) => c.id === item.category) || {}
                          ).name || item.category}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-semibold">
                      {item.purchaseQuantity}
                    </td>
                    <td className="p-4 text-right font-mono">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onUpdateStatus([item.id])}
                          className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg"
                          title={t("confirm_purchased_count", { count: 1 })}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onCancel("cancel-purchasing", item)}
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                          title={t("cancel_purchase")}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <p className="text-gray-500">{t("no_data_available")}</p>
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

export default PurchasingView;
