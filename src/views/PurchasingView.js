// src/views/PurchasingView.js
import React from "react";
import { CheckCircle, RotateCcw, TrashIcon, XCircle } from "lucide-react";

const PurchasingView = ({ items, onUpdateStatus, onCancel, categories, t }) => {
  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "0";
    return new Intl.NumberFormat(t("locale_string")).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Card Tiêu đề */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {t("purchasing_list")}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t("purchasing_desc")}
        </p>
      </div>

      {/* Card Danh sách */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left font-medium uppercase">
                  {t("device_name")}
                </th>
                <th className="px-6 py-3 text-left font-medium uppercase">
                  {t("category")}
                </th>
                <th className="px-6 py-3 text-right font-medium uppercase">
                  {t("purchase_quantity")}
                </th>
                <th className="px-6 py-3 text-right font-medium uppercase">
                  {t("price")} (VNĐ)
                </th>
                <th className="px-6 py-3 text-center font-medium uppercase">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {items && items.length > 0 ? (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 capitalize">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {item.purchaseQuantity}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onUpdateStatus([item.id])}
                          className="p-2"
                          title={t("confirm_purchased_count", { count: 1 })}
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 hover:text-green-400" />
                        </button>
                        <button
                          onClick={() => onCancel("revert-purchasing", item)}
                          className="p-2"
                          title={t("revert_to_pending")}
                        >
                          <RotateCcw className="w-4 h-4 text-yellow-600 hover:text-yellow-400" />
                        </button>
                        <button
                          onClick={() => onCancel("cancel-purchasing", item)}
                          className="p-2"
                          title={t("cancel_purchase")}
                        >
                          <XCircle className="w-4 h-4 text-red-600 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <p className="text-sm">{t("no_data_available")}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-4 p-4">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg p-4 space-y-2 shadow bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onUpdateStatus([item.id])}
                      className="p-2"
                      title={t("confirm_purchased_count", { count: 1 })}
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 hover:text-green-400" />
                    </button>
                    <button
                      onClick={() => onCancel("cancel-purchasing", item)}
                      className="p-2"
                      title={t("cancel_purchase")}
                    >
                      <TrashIcon className="w-4 h-4 text-red-600 hover:text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300 pt-2 border-t dark:border-gray-700">
                  <p>
                    <strong>{t("purchase_quantity")}:</strong>{" "}
                    <span className="font-semibold">
                      {item.purchaseQuantity}
                    </span>
                  </p>
                  <p>
                    <strong>{t("price")}:</strong>{" "}
                    <span className="font-semibold">
                      {formatCurrency(item.price)} VNĐ
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-sm">{t("no_data_available")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasingView;
