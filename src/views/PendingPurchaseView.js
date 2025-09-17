// src/views/PendingPurchaseView.js
import React, { useState, useMemo } from "react";
import { ShoppingCart, Trash2, Plus, Search, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

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
    if (!searchQuery) {
      return items;
    }
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleDataChange = (id, field, value) => {
    setPurchaseData((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}), // Ensure object exists before spreading
        [field]: value,
      },
    }));
  };

  const handlePurchaseClick = (item) => {
    const price = parseFloat(purchaseData[item.id]?.price);
    const quantity = parseInt(purchaseData[item.id]?.quantity, 10) || 1;

    if (!price || price <= 0) {
      toast.error(t("toast_price_is_required"));
      return;
    }

    const itemToPurchase = {
      id: item.id,
      quantity: quantity,
      price: price,
    };

    onStartPurchase([itemToPurchase]);
  };

  return (
    <div className="space-y-6 animate-scaleIn">
      {/* --- FILTER SECTION --- */}
      <div className="glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 bg-clip-text text-transparent">
              {t("pending_purchase_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("pending_purchase_desc")}
            </p>
            <div className="h-0.5 w-16 bg-gradient-to-r from-gray-500 to-gray-700 mt-2 rounded-full" />
          </div>
          <div className="md:hidden">
            <button
              onClick={onOpenAddFromMasterModal}
              className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
              title={t("add_from_master_list")}
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("search")}
            </label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder={t("search_master_item_placeholder")}
                className="w-full pl-10 pr-4 py-2.5 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-0">
              .
            </label>
            <button
              onClick={onOpenAddFromMasterModal}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 text-sm font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>{t("add_from_master_list")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hidden md:block border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3.5 text-left font-medium uppercase">
                  {t("device_name")}
                </th>
                <th className="px-4 py-3.5 text-left font-medium uppercase">
                  {t("category")}
                </th>
                <th className="px-4 py-3.5 text-center font-medium uppercase">
                  {t("purchase_quantity")}
                </th>
                <th className="px-4 py-3.5 text-right font-medium uppercase">
                  {t("price")} (VNĐ)
                </th>
                <th className="px-4 py-3.5 text-center font-medium uppercase">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      index % 2 === 0 ? "bg-gray-50/30 dark:bg-gray-900/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                      {item.name}
                    </td>
                    <td className="px-4 py-3.5 capitalize text-gray-600 dark:text-gray-300">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="number"
                        min="1"
                        value={purchaseData[item.id]?.quantity || 1}
                        onChange={(e) =>
                          handleDataChange(item.id, "quantity", e.target.value)
                        }
                        className="w-24 p-2 border-2 rounded-xl text-center dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={purchaseData[item.id]?.price || ""}
                        onChange={(e) =>
                          handleDataChange(item.id, "price", e.target.value)
                        }
                        className="w-36 p-2 border-2 rounded-xl text-right dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handlePurchaseClick(item)}
                          className="p-2 rounded-lg text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                          title={t("purchasing")}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteItem("delete-pending", item)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          title={t("delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-16">
                    <p className="text-gray-500 text-sm">
                      {t("no_data_available")}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden space-y-4">
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 space-y-3"
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
                <button
                  onClick={() => onDeleteItem("delete-pending", item)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 -mt-2 -mr-2"
                  title={t("delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-end gap-3 pt-3 border-t dark:border-gray-700">
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("purchase_quantity")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={purchaseData[item.id]?.quantity || 1}
                    onChange={(e) =>
                      handleDataChange(item.id, "quantity", e.target.value)
                    }
                    className="w-full p-2 border-2 rounded-xl text-center dark:bg-gray-700"
                  />
                </div>
                <div className="flex-grow">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("price")} (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={purchaseData[item.id]?.price || ""}
                    onChange={(e) =>
                      handleDataChange(item.id, "price", e.target.value)
                    }
                    className="w-full p-2 border-2 rounded-xl text-right dark:bg-gray-700"
                  />
                </div>
                <button
                  onClick={() => handlePurchaseClick(item)}
                  className="p-2.5 rounded-xl text-green-500 bg-green-50 dark:bg-green-900/30 hover:bg-green-100"
                  title={t("purchasing")}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
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

export default PendingPurchaseView;
