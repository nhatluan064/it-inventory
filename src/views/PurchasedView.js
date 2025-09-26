import React, { useState } from "react";
import toast from "react-hot-toast";
import { LogIn, CheckCircle, Layers } from "lucide-react";
import { useSort } from "../hooks/useSort";

const PurchasedView = ({
  items,
  onImportItem,
  categories,
  t,
  _fullInventory,
}) => {
  const [importingIds, setImportingIds] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState({});

  const {
    items: sortedItems,
    requestSort,
    sortConfig,
  } = useSort(items, { key: "name", direction: "ascending" });

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

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">{/* Page transition */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">{/* Header animation */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 bg-clip-text text-transparent">
          {t("purchased_list")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("purchased_desc")}
        </p>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp">{/* Table animation */}
        <div className="flex-grow overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th
                  className="px-3 py-2 text-left font-medium cursor-pointer select-none text-xs"
                  onClick={() => requestSort("name")}
                >
                  {t("device_name")}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="px-3 py-2 text-left font-medium cursor-pointer select-none text-xs"
                  onClick={() => requestSort("category")}
                >
                  {t("category")}
                  {sortConfig.key === "category" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="px-3 py-2 text-center font-medium w-24 text-xs">
                  {t("quantity")}
                </th>
                <th className="px-3 py-2 font-medium w-1/3 text-xs">
                  {t("serial_number_sn")}
                </th>
                <th className="px-3 py-2 text-center font-medium w-32 text-xs">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => {
                  const isImporting = importingIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-opacity duration-300 ${
                        isImporting ? "opacity-50" : ""
                      }`}
                    >
                      <td className="p-3 font-medium text-xs">{item.name}</td>
                      <td className="p-3 capitalize text-xs">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-gray-500" />
                          <span>
                            {(
                              categories.find((c) => c.id === item.category) ||
                              {}
                            ).name || item.category}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-medium text-xs">
                        {item.purchaseQuantity}
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={serialNumbers[item.id] || ""}
                          onChange={(e) =>
                            handleSnChange(item.id, e.target.value)
                          }
                          placeholder={t("add_multiple_sn_placeholder")}
                          className="w-full text-xs p-2 border-2 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleImportClick(item)}
                          disabled={isImporting}
                          title={t("import_to_inventory")}
                          className={`p-2.5 rounded-lg transition-all duration-200 flex justify-center items-center w-full max-w-[100px] mx-auto animate-hoverScale ${
                            isImporting
                              ? "bg-gray-300 text-gray-500 cursor-wait"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                          }`}
                        >
                          {isImporting ? (
                            <CheckCircle className="w-5 h-5 animate-pulse" />
                          ) : (
                            <LogIn className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <p className="text-sm text-gray-500">
                      {t("no_data_available")}
                    </p>
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

export default PurchasedView;
