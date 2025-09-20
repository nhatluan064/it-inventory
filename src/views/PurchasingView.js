import React from "react";
import { CheckCircle, XCircle, Layers } from "lucide-react";
import { useSort } from "../hooks/useSort"; // <<< THÊM IMPORT useSort

const PurchasingView = ({ items, onUpdateStatus, onCancel, categories, t }) => {
  // <<< SỬ DỤNG useSort >>>
  const { items: sortedItems, requestSort, sortConfig } = useSort(items, { key: 'name', direction: 'ascending' });

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "0";
    return new Intl.NumberFormat(t("locale_string")).format(amount);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* KHỐI HEADER */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          {t("purchasing_list")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("purchasing_desc")}
        </p>
      </div>

      {/* KHỐI DANH SÁCH SẢN PHẨM */}
      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          {/* <<< CẬP NHẬT HEADER VỚI SỰ KIỆN onClick >>> */}
          <div className="hidden md:grid md:grid-cols-[1fr,150px,100px,120px,120px] gap-4 px-4 py-4 border-b-2 border-gray-100 dark:border-gray-400">
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none" onClick={() => requestSort('name')}>
              {t("device_name")}
              {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </h3>
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none" onClick={() => requestSort('category')}>
              {t("category")}
              {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </h3>
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 text-center">{t("purchase_quantity")}</h3>
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 text-right">{t("price")} (VNĐ)</h3>
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 text-center">{t("actions")}</h3>
          </div>

          {/* <<< DÙNG sortedItems ĐỂ RENDER >>> */}
          <div className="p-4 md:p-0 md:divide-y divide-gray-100 dark:divide-gray-700">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <div
                  key={item.id}
                  className="block p-4 border dark:border-gray-600 md:border-0 rounded-lg mb-4 md:rounded-none md:mb-0
                             md:grid md:grid-cols-[1fr,150px,100px,120px,120px] md:gap-4 md:items-center md:px-4 md:py-2"
                >
                  <div className="grid grid-cols-2 gap-4 items-start md:contents">
                    <div>
                      <label className="md:hidden text-xs font-medium text-gray-500">{t("device_name")}</label>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                    </div>
                    <div>
                      <label className="md:hidden text-xs font-medium text-gray-500">{t("category")}</label>
                      <div className="flex items-center mt-1 gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Layers className="w-3.5 h-3.5 text-gray-500" />
                        <span className="capitalize text-gray-700 dark:text-gray-300 text-xs">
                          {(categories.find((c) => c.id === item.category) || {}).name || item.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 md:contents">
                    <div className="md:text-center">
                      <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{t("purchase_quantity")}</label>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{item.purchaseQuantity}</p>
                    </div>
                    <div className="md:text-right">
                      <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{t("price")} (VNĐ)</label>
                      <p className="font-mono text-gray-600 dark:text-gray-300 mt-1">{formatCurrency(item.price)}</p>
                    </div>
                  </div>

                  <div className="md:text-center mt-4 md:mt-0 flex items-center justify-center gap-2">
                    <button
                      onClick={() => onUpdateStatus([item.id])}
                      className="p-2 w-full md:w-auto text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg border dark:border-gray-600"
                      title={t("confirm_purchased_count", { count: 1 })}
                    >
                      <CheckCircle className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => onCancel("cancel-purchasing", item)}
                      className="p-2 w-full md:w-auto text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg border dark:border-gray-600"
                      title={t("cancel_purchase")}
                    >
                      <XCircle className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">{t("no_data_available")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasingView;