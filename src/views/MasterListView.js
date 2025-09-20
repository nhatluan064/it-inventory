import React, { useState } from "react";
import { Plus, Package, Search, Edit2, Trash2, Layers, Filter } from "lucide-react";
import { useSort } from "../hooks/useSort";

const MasterListView = ({
  allItems,
  onAddType,
  onEditItem,
  onDeleteItem,
  categories,
  t,
  fullEquipmentList,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredItems = allItems.filter((item) => {
    const categoryMatch =
      selectedCategory === "all" || item.category === selectedCategory;
    const searchMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const { items: sortedItems, requestSort, sortConfig } = useSort(filteredItems, { key: 'name', direction: 'ascending' });

  return (
    <div className="h-full flex flex-col gap-6">
      {/* --- CARD 1: KHỐI TIÊU ĐỀ VÀ BỘ LỌC --- */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {t("master_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("master_list_desc")}
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
              onClick={onAddType}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">{t("add_new_master_item")}</span>
            </button>
          </div>
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-end ${isMobileFilterOpen ? "grid" : "hidden md:grid"}`}
        >
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
          <select
            className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- CARD 2: KHỐI DANH SÁCH --- */}
      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          <div className="hidden md:grid md:grid-cols-[1fr,180px,180px,120px] gap-4 px-4 py-3.5 border-b-2 border-gray-100 dark:border-gray-400">
            <h3 className="font-medium uppercase text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none" onClick={() => requestSort('name')}>
              {t("master_item_name")}
              {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </h3>
            <h3 className="font-medium uppercase text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none" onClick={() => requestSort('category')}>
              {t("category")}
              {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
            </h3>
            <h3 className="font-medium uppercase text-xs text-gray-500 dark:text-gray-400">
              {t("usage_status")}
            </h3>
            <h3 className="font-medium uppercase text-xs text-gray-500 dark:text-gray-400 text-center">
              {t("actions")}
            </h3>
          </div>

          <div className="p-4 md:p-0 md:divide-y divide-gray-100 dark:divide-gray-700">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => {
                const isModelInUse = fullEquipmentList.some(
                  (e) =>
                    e.name.split(" (User:")[0].trim() === item.name &&
                    e.category === item.category &&
                    e.status !== "master"
                );
                const statusText = isModelInUse ? t("has_been_used") : t("never_used");
                const statusColor = isModelInUse ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-500 dark:text-gray-400";
                
                return (
                  <div
                    key={item.id}
                    className="block p-4 border dark:border-gray-600 rounded-lg mb-4 md:border-0 md:rounded-none md:mb-0 
                               md:grid md:grid-cols-[1fr,180px,180px,120px] md:gap-4 md:items-center md:px-4 md:py-3"
                  >
                    <div className="grid grid-cols-2 gap-4 items-start md:contents">
                      <div>
                        <label className="block md:hidden text-xs font-medium text-gray-500">{t("master_item_name")}</label>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
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
                    <div className="mt-4 md:mt-0">
                       <label className="block md:hidden text-xs font-medium text-gray-500">{t("usage_status")}</label>
                      <p className={statusColor}>{statusText}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* <<< SỬA MÀU ICON EDIT TẠI ĐÂY >>> */}
                        <button
                          onClick={() => onEditItem(item)}
                          disabled={isModelInUse}
                          className="p-2 w-full md:w-auto text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-40 rounded-lg border dark:border-gray-600"
                          title={isModelInUse ? t("cannot_edit_used_model") : t("edit")}
                        >
                          <Edit2 className="w-4 h-4 mx-auto" />
                        </button>
                        {/* <<< SỬA MÀU ICON DELETE TẠI ĐÂY >>> */}
                        <button
                          onClick={() => onDeleteItem(item)}
                          className="p-2 w-full md:w-auto text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg border dark:border-gray-600"
                          title={t("delete")}
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <Package className="w-12 h-12 mx-auto text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">
                  {t("no_master_items_found")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterListView;