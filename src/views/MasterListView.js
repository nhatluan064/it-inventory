// src/views/MasterListView.js
import React, { useState } from "react";
import { Plus, Package, Search, Edit2, Trash2, SlidersHorizontal, X } from "lucide-react";

const MasterListView = ({
  allItems,
  onAddType,
  onEditItem,
  onDeleteItem,
  categories,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const uniqueItems = allItems.reduce((acc, current) => {
    const originalName = current.name.split(" (User:")[0];
    if (!acc.some((item) => item.name.split(" (User:")[0] === originalName)) {
      const originalItem = allItems.find((i) => i.name === originalName);
      acc.push(originalItem || { ...current, name: originalName });
    }
    return acc;
  }, []);

  const filteredItems = uniqueItems.filter((item) => {
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
        {/* Container cho tiêu đề và nút lọc */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{t("master_list")}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("master_list_desc")}
            </p>
          </div>
          {/* Nút bộ lọc cho Mobile */}
          <div className="md:hidden">
            <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
            >
                {isMobileFilterOpen ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Khu vực tìm kiếm và thêm mới */}
        <div
          className={`
            flex-col md:flex-row md:items-center gap-4
            ${isMobileFilterOpen ? 'flex' : 'hidden md:flex'}
          `}
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("search_master_item_placeholder")}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full md:w-48 py-2 px-3 border rounded-lg text-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
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
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t("add_new_master_item")}</span>
          </button>
        </div>
      </div>

      {/* --- Giao diện Bảng cho Desktop --- */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left font-medium uppercase">
                  {t("master_item_name")}
                </th>
                <th className="px-6 py-3 text-left font-medium uppercase">
                  {t("category")}
                </th>
                <th className="px-6 py-3 text-left font-medium uppercase">
                  {t("usage_status")}
                </th>
                <th className="px-6 py-3 text-center font-medium uppercase">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isModelInUse = allItems.some(
                    (e) =>
                      e.name.startsWith(item.name) &&
                      e.status !== "pending-purchase"
                  );
                  const statusText = isModelInUse
                    ? t("has_been_used")
                    : t("never_used");
                  const statusColor = isModelInUse
                    ? "text-green-600 dark:text-green-400 font-semibold"
                    : "text-gray-500 dark:text-gray-400";
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4 capitalize">
                        {(categories.find((c) => c.id === item.category) || {})
                          .name || item.category}
                      </td>
                      <td className={`px-6 py-4 ${statusColor}`}>
                        {statusText}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-2"
                            title={t("edit")}
                          >
                            <Edit2 className="w-5 h-5 text-blue-600 hover:text-blue-400" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item)}
                            className="p-2"
                            title={t("delete")}
                          >
                            <Trash2 className="w-5 h-5 text-red-600 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="mt-2">{t("no_master_items_found")}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Giao diện Card cho Mobile --- */}
      <div className="md:hidden space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isModelInUse = allItems.some(
              (e) =>
                e.name.startsWith(item.name) && e.status !== "pending-purchase"
            );
            const statusText = isModelInUse
              ? t("has_been_used")
              : t("never_used");
            const statusColor = isModelInUse
              ? "text-green-600 dark:text-green-400 font-semibold"
              : "text-gray-500 dark:text-gray-400";
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-2"
                      title={t("edit")}
                    >
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item)}
                      className="p-2"
                      title={t("delete")}
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
                <div
                  className={`text-sm pt-2 border-t dark:border-gray-700 ${statusColor}`}
                >
                  <span>
                    {t("usage_status")}: {statusText}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Package className="w-12 h-12 mx-auto text-gray-300" />
            <p className="mt-2">{t("no_master_items_found")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterListView;

