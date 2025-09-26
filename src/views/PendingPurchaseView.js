import React, { useState, useMemo } from "react";
import { ShoppingCart, Trash2, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useSort } from "../hooks/useSort";

const PendingPurchaseView = ({
  items,
  onStartPurchase,
  onDeleteItem,
  onOpenAddFromMasterModal,
  categories,
  t,
}) => {
  const [purchaseData, setPurchaseData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const {
    items: sortedItems,
    requestSort,
    sortConfig,
  } = useSort(filteredItems, { key: "name", direction: "ascending" });

  const handleDataChange = (id, field, value) => {
    setPurchaseData((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const handlePurchaseClick = (item) => {
    const price = parseFloat(purchaseData[item.id]?.price);
    const quantity = parseInt(purchaseData[item.id]?.quantity, 10) || 1;
    if (!price || price <= 0) {
      toast.error(t("toast_price_is_required"));
      return;
    }
    onStartPurchase([{ id: item.id, quantity, price }]);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">{/* Page transition */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">{/* Header animation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 bg-clip-text text-transparent">
              {t("pending_purchase_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("pending_purchase_desc")}
            </p>
          </div>
          <button
            onClick={onOpenAddFromMasterModal}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold animate-hoverScale transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>{t("add_from_master_list")}</span>
          </button>
        </div>

        <div>
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("search_master_item_placeholder")}
              className="w-full pl-9 pr-4 py-2 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp">{/* Table container animation */}
        <div className="flex-grow overflow-y-auto hide-scrollbar">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th
                  className="px-3 py-2 text-left font-semibold cursor-pointer select-none text-xs"
                  onClick={() => requestSort("name")}
                >
                  {t("device_name")}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="px-3 py-2 text-left font-semibold cursor-pointer select-none text-xs"
                  onClick={() => requestSort("category")}
                >
                  {t("category")}
                  {sortConfig.key === "category" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="px-3 py-2 text-center font-semibold text-xs">
                  {t("purchase_quantity")}
                </th>
                <th className="px-3 py-2 text-right font-semibold text-xs">
                  {t("price")} (VNĐ)
                </th>
                <th className="px-3 py-2 text-center font-semibold text-xs">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="p-3 font-medium text-xs">{item.name}</td>
                  <td className="p-3 capitalize text-xs">
                    {(categories.find((c) => c.id === item.category) || {})
                      .name || item.category}
                  </td>
                  <td className="p-3 w-32">
                    <input
                      type="number"
                      min="1"
                      value={purchaseData[item.id]?.quantity || 1}
                      onChange={(e) =>
                        handleDataChange(item.id, "quantity", e.target.value)
                      }
                      className="w-full p-1.5 border-2 rounded-lg text-center text-xs dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td className="p-3 w-40">
                    <input
                      type="number"
                      min="0"
                      value={purchaseData[item.id]?.price || ""}
                      onChange={(e) =>
                        handleDataChange(item.id, "price", e.target.value)
                      }
                      className="w-full p-1.5 border-2 rounded-lg text-right text-xs dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td className="p-3 text-center w-32">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePurchaseClick(item)}
                        className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg animate-hoverScale transition-all duration-200"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg animate-hoverScale transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingPurchaseView;
