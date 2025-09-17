// src/views/PendingPurchaseView.js
import React, { useState, useMemo } from "react";
import { ShoppingCart, Edit2, Trash2, PlusCircle, Search } from "lucide-react";
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
        ...prev[id],
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
    setPurchaseData({});
  };

  return (
    <div className="space-y-6">
      {/* Card Tiêu đề & Lọc */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {t("pending_purchase_list")}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("pending_purchase_desc")}
            </p>
          </div>
          <div className="lg:hidden">
            <button
              onClick={onOpenAddFromMasterModal}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
              title={t("add_from_master_list")}
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("search_master_item_placeholder")}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
          <button
            onClick={onOpenAddFromMasterModal}
            className="w-full md:w-auto flex-shrink-0 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 items-center justify-center space-x-2 text-xs font-semibold hidden md:flex"
            title={t("add_from_master_list")}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t("add_from_master_list")}</span>
          </button>
        </div>
      </div>

      {/* Card Danh sách cho Desktop */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left font-medium uppercase">{t("device_name")}</th>
                <th className="px-6 py-3 text-left font-medium uppercase">{t("category")}</th>
                <th className="px-6 py-3 text-center font-medium uppercase" style={{ width: "120px" }}>{t("purchase_quantity")}</th>
                <th className="px-6 py-3 text-right font-medium uppercase" style={{ width: "150px" }}>{t("price")} (VNĐ)</th>
                <th className="px-6 py-3 text-center font-medium uppercase">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 capitalize">{(categories.find((c) => c.id === item.category) || {}).name || item.category}</td>
                    <td className="px-6 py-4 text-center">
                      <input type="number" min="1" value={purchaseData[item.id]?.quantity || 1} onChange={(e) => handleDataChange(item.id, "quantity", e.target.value)} className="w-20 p-1 border rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"/>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <input type="number" min="0" placeholder="0" value={purchaseData[item.id]?.price || ""} onChange={(e) => handleDataChange(item.id, "price", e.target.value)} className="w-32 p-1 border rounded-md text-right dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"/>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handlePurchaseClick(item)} className="p-2" title={t("purchasing")}><ShoppingCart className="w-4 h-4 text-green-600 hover:text-green-400" /></button>
                        <button onClick={() => onDeleteItem("delete-pending", item)} className="p-2" title={t("delete")}><Trash2 className="w-4 h-4 text-red-600 hover:text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-12"><p className="text-gray-500 text-sm">{t("no_data_available")}</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Danh sách Card cho Mobile (nằm riêng, không bị bọc bởi card khác) */}
      <div className="md:hidden space-y-3">
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{(categories.find((c) => c.id === item.category) || {}).name || item.category}</p>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => onDeleteItem("delete-pending", item)} className="p-2" title={t("delete")}><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <div className="flex flex-items items-center gap-8 pt-2 border-t dark:border-gray-700">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t("purchase_quantity")}</label>
                  <input type="number" min="1" value={purchaseData[item.id]?.quantity || 1} onChange={(e) => handleDataChange(item.id, "quantity", e.target.value)} className="w-full p-2 border rounded-md text-center dark:bg-gray-700 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t("price")} (VNĐ)</label>
                  <input type="number" min="0" placeholder="0" value={purchaseData[item.id]?.price || ""} onChange={(e) => handleDataChange(item.id, "price", e.target.value)} className="w-full p-2 border rounded-md text-right dark:bg-gray-700 text-sm"/>
                </div>
                <button onClick={() => handlePurchaseClick(item)} className="p-2 pt-6" title={t("purchasing")}><ShoppingCart className="w-4 h-4 text-green-500" /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-sm">{t("no_data_available")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPurchaseView;