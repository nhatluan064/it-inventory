import React, { useState } from "react";
import toast from "react-hot-toast";
import { LogIn, CheckCircle, Layers } from "lucide-react";
import { useSort } from "../hooks/useSort"; // <<< THÊM IMPORT useSort

const PurchasedView = ({
  items,
  onImportItem,
  categories,
  t,
  fullInventory,
}) => {
  const [importingIds, setImportingIds] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState({});

  // <<< SỬ DỤNG useSort >>>
  const { items: sortedItems, requestSort, sortConfig } = useSort(items, { key: 'name', direction: 'ascending' });

  const handleSnChange = (id, value) => {
    setSerialNumbers((prev) => ({ ...prev, [id]: value }));
  };

  const handleImportClick = (item) => {
    // ... logic giữ nguyên
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* KHỐI HEADER */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 bg-clip-text text-transparent">
          {t("purchased_list")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("purchased_desc")}
        </p>
      </div>

      {/* KHỐI DANH SÁCH SẢN PHẨM */}
      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          {/* <<< CẬP NHẬT HEADER VỚI SỰ KIỆN onClick >>> */}
          <div className="hidden md:grid md:grid-cols-[1fr,150px,80px,1fr,120px] gap-4 px-4 py-4 border-b-2 border-gray-100 dark:border-gray-400">
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none" onClick={() => requestSort('name')}>
                {t("device_name")}
                {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </h3>
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none" onClick={() => requestSort('category')}>
                {t("category")}
                {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </h3>
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 text-center">{t("quantity")}</h3>
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400">{t("serial_number_sn")}</h3>
            <h3 className="font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 text-center">{t("actions")}</h3>
          </div>

          {/* <<< DÙNG sortedItems ĐỂ RENDER >>> */}
          <div className="p-4 md:p-0 md:divide-y divide-gray-100 dark:divide-gray-700">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => {
                const isImporting = importingIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`block p-4 border dark:border-gray-600 md:border-0 rounded-lg mb-4 md:rounded-none md:mb-0
                               md:grid md:grid-cols-[1fr,150px,80px,1fr,120px] md:gap-4 md:items-center md:px-4 md:py-2
                               transition-opacity duration-500 ${isImporting ? "opacity-20" : "opacity-100"}`}
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

                    <div className="mt-4 md:mt-0 md:text-center">
                      <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{t("quantity")}</label>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{item.purchaseQuantity}</p>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{t("serial_number_sn")}</label>
                      <input
                        type="text"
                        value={serialNumbers[item.id] || ""}
                        onChange={(e) => handleSnChange(item.id, e.target.value)}
                        placeholder={t("add_multiple_sn_placeholder")}
                        className="w-full text-xs p-2 border-2 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:text-center">
                      <button
                        onClick={() => handleImportClick(item)}
                        disabled={isImporting}
                        title={t("import_to_inventory")}
                        className={`p-2.5 w-full md:w-auto rounded-lg transition-all duration-300 flex justify-center ${
                          isImporting
                            ? "bg-green-500 text-white animate-pulse"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                        }`}
                      >
                        {isImporting ? <CheckCircle className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <p className="text-sm text-gray-500">
                  {t("no_data_available")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasedView;