// src/views/MasterListView.js
import React, { useState } from "react";
import { Plus, Package, Search, PlusCircle, Edit, Edit2, Trash2, Filter, X } from "lucide-react";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredItems = allItems.filter((item) => {
    const categoryMatch =
      selectedCategory === "all" || item.category === selectedCategory;
    const searchMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold">{t("master_list")}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {t("master_list_desc")}
            </p>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {/* --- NÚT THÊM MỚI CHO MOBILE ĐÃ ĐƯỢC CẬP NHẬT --- */}
            {/* Nút Thêm mới (đúng) */}
            <button
              onClick={onAddType}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
              title={t("add_new_master_item")}
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md"
            >
              {isFilterOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Filter className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`lg:flex flex-col lg:flex-row lg:items-center gap-4 ${
            isFilterOpen ? "flex" : "hidden"
          }`}
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("search_master_item_placeholder")}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full lg:w-48 py-2 px-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={onAddType}
            className="w-full lg:w-auto flex-shrink-0 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 items-center justify-center space-x-2 text-xs font-semibold hidden lg:flex h-9"
          >
            <Plus className="w-4 h-4" />
            <span>{t("add_new_master_item")}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left font-medium uppercase">{t("master_item_name")}</th>
                <th className="px-6 py-3 text-left font-medium uppercase">{t("category")}</th>
                <th className="px-6 py-3 text-left font-medium uppercase">{t("usage_status")}</th>
                <th className="px-6 py-3 text-center font-medium uppercase">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isModelInUse = fullEquipmentList.some(
                    (e) => e.name.split(" (User:")[0].trim() === item.name && e.category === item.category && e.status !== "master"
                  );
                  const statusText = isModelInUse ? t("has_been_used") : t("never_used");
                  const statusColor = isModelInUse ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-500 dark:text-gray-400";
                  return (
                    <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4 capitalize">{(categories.find((c) => c.id === item.category) || {}).name || item.category}</td>
                      <td className={`px-6 py-4 ${statusColor}`}>{statusText}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onEditItem(item)}
                            disabled={isModelInUse}
                            className={`p-2 ${isModelInUse ? "cursor-not-allowed" : ""}`}
                            title={isModelInUse ? t("cannot_edit_used_model") : t("edit")}
                          >
                            <Edit2 className={`w-4 h-4 ${isModelInUse ? "text-gray-600" : "text-yellow-400 hover:text-blue-400"}`}/>
                          </button>
                          <button
                            onClick={() => onDeleteItem(item)}
                            className="p-2"
                            title={t("delete")}
                          >
                            <Trash2 className="w-4 h-4 text-red-600 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="4" className="text-center py-12"><Package className="w-10 h-10 mx-auto text-gray-300" /><p className="mt-2 text-sm">{t("no_master_items_found")}</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isModelInUse = fullEquipmentList.some(
              (e) => e.name.split(" (User:")[0].trim() === item.name && e.category === item.category && e.status !== "master"
            );
            const statusText = isModelInUse ? t("has_been_used") : t("never_used");
            const statusColor = isModelInUse ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-500 dark:text-gray-400";
            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2 min-h-26 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-xs">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{(categories.find((c) => c.id === item.category) || {}).name || item.category}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditItem(item)}
                      disabled={isModelInUse}
                      className={`p-2 ${isModelInUse ? "cursor-not-allowed" : ""}`}
                      title={isModelInUse ? t("cannot_edit_used_model") : t("edit")}
                    >
                      <Edit className={`w-4 h-4 ${isModelInUse ? "text-gray-600" : "text-yellow-400"}`} />
                    </button>
                    
                  </div>
                </div>
                <div className={`text-xs pt-4 border-t dark:border-gray-700 ${statusColor}`}>
                  <span>{t("usage_status")}: {statusText}</span>
                  <button
                      onClick={() => onDeleteItem(item)}
                      className="p-2 pt-1 float-right"
                      title={t("delete")}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Package className="w-10 h-10 mx-auto text-gray-300" />
            <p className="mt-2 text-sm">{t("no_master_items_found")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterListView;