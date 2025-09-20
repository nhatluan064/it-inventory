import React, { useState, useMemo } from "react";
import { ShoppingCart, Trash2, Plus, Search, Layers, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { useSort } from "../hooks/useSort"; // <<< THÊM IMPORT useSort

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // <<< SỬ DỤNG useSort VỚI DANH SÁCH ĐÃ LỌC >>>
  const { items: sortedItems, requestSort, sortConfig } = useSort(filteredItems, { key: 'name', direction: 'ascending' });

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
    <div className="h-full flex flex-col gap-6">
      {/* KHỐI HEADER VÀ BỘ LỌC */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 bg-clip-text text-transparent">
              {t("pending_purchase_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("pending_purchase_desc")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={onOpenAddFromMasterModal}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">{t("add_from_master_list")}</span>
            </button>
          </div>
        </div>
        
        <div className={`${isMobileFilterOpen ? "block" : "hidden md:block"}`}>
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

      {/* KHỐI DANH SÁCH SẢN PHẨM */}
      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          {/* <<< CẬP NHẬT HEADER VỚI onClick VÀ ICON SẮP XẾP >>> */}
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

          {/* <<< SỬ DỤNG "sortedItems" THAY VÌ "filteredItems" ĐỂ RENDER >>> */}
          <div className="p-4 md:p-0 md:divide-y divide-gray-100 dark:divide-gray-700">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="block p-4 border dark:border-gray-600 md:border-0 rounded-lg mb-4 md:rounded-none md:mb-0
                           md:grid md:grid-cols-[1fr,150px,100px,120px,120px] md:gap-4 md:items-center md:px-4 md:py-2"
              >
                <div className="grid grid-cols-2 gap-4 items-start md:contents">
                  <div>
                    <label className="block md:hidden text-xs font-medium text-gray-500">{t("device_name")}</label>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{item.name}</p>
                  </div>
                  <div>
                    <label className="block md:hidden text-xs font-medium text-gray-500">{t("category")}</label>
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
                    <input
                      type="number"
                      min="1"
                      value={purchaseData[item.id]?.quantity || 1}
                      onChange={(e) => handleDataChange(item.id, "quantity", e.target.value)}
                      className="w-full md:w-20 p-2 border-2 rounded-lg text-center dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="md:text-right">
                    <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{t("price")} (VNĐ)</label>
                    <input
                      type="number"
                      min="0"
                      value={purchaseData[item.id]?.price || ""}
                      onChange={(e) => handleDataChange(item.id, "price", e.target.value)}
                      className="w-full md:w-28 p-2 border-2 rounded-lg text-right dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="md:text-center mt-4 md:mt-0 flex items-center justify-center gap-2">
                   <button onClick={() => handlePurchaseClick(item)} className="p-2 w-full md:w-auto text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg border dark:border-gray-600">
                      <ShoppingCart className="w-4 h-4 mx-auto" />
                    </button>
                    <button onClick={() => onDeleteItem(item)} className="p-2 w-full md:w-auto text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg border dark:border-gray-600">
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPurchaseView;