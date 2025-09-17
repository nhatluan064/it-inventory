// src/views/PurchasingView.js
import React from "react";
import { CheckCircle, RotateCcw, XCircle } from "lucide-react";

const PurchasingView = ({ items, onUpdateStatus, onCancel, categories, t }) => {
  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "0";
    return new Intl.NumberFormat(t("locale_string")).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER CARD --- */}
      <div className="glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          {t("purchasing_list")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("purchasing_desc")}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mt-2 rounded-full" />
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hidden md:block border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3.5 text-left font-medium uppercase">{t("device_name")}</th>
                <th className="px-4 py-3.5 text-left font-medium uppercase">{t("category")}</th>
                <th className="px-4 py-3.5 text-right font-medium uppercase">{t("purchase_quantity")}</th>
                <th className="px-4 py-3.5 text-right font-medium uppercase">{t("price")} (VNĐ)</th>
                <th className="px-4 py-3.5 text-center font-medium uppercase">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items && items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={item.id} className={`transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${index % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-900/20' : ''}`}>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">{item.name}</td>
                    <td className="px-4 py-3.5 capitalize text-gray-600 dark:text-gray-300">
                      {(categories.find((c) => c.id === item.category) || {}).name || item.category}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-gray-800 dark:text-gray-200">{item.purchaseQuantity}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-gray-600 dark:text-gray-300">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => onUpdateStatus([item.id])} className="p-2 rounded-lg text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30" title={t("confirm_purchased_count", { count: 1 })}>
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => onCancel("revert-purchasing", item)} className="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30" title={t("revert_to_pending")}>
                           <RotateCcw className="w-4 h-4" />
                        </button>
                        <button onClick={() => onCancel("cancel-purchasing", item)} className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" title={t("cancel_purchase")}>
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-16"><p className="text-gray-500 text-sm">{t("no_data_available")}</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        
      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden space-y-4">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 space-y-3">
                 <div className="flex items-start justify-between">
                    <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {(categories.find((c) => c.id === item.category) || {}).name || item.category}
                        </p>
                    </div>
                    <div className="flex items-center space-x-1 -mt-2 -mr-2">
                         <button onClick={() => onUpdateStatus([item.id])} className="p-2 rounded-xl text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30" title={t("confirm_purchased_count", { count: 1 })}>
                            <CheckCircle className="w-4 h-4" />
                        </button>
                         <button onClick={() => onCancel("revert-purchasing", item)} className="p-2 rounded-xl text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30" title={t("revert_to_pending")}>
                           <RotateCcw className="w-4 h-4" />
                        </button>
                        <button onClick={() => onCancel("cancel-purchasing", item)} className="p-2 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" title={t("cancel_purchase")}>
                          <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300 pt-3 border-t dark:border-gray-700">
                  <p><strong>{t("purchase_quantity")}:</strong> <span className="font-semibold">{item.purchaseQuantity}</span></p>
                  <p><strong>{t("price")}:</strong> <span className="font-semibold">{formatCurrency(item.price)} VNĐ</span></p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow text-center py-16 text-gray-500 dark:text-gray-400">
              <p className="text-sm">{t("no_data_available")}</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default PurchasingView;