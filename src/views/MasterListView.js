// src/views/MasterListView.js
import React, { useState } from "react";
import {
  Plus,
  Package,
  Search,
  PlusCircle,
  Edit,
  Edit2,
  Trash2,
  Filter,
  X,
  Layers,
} from "lucide-react";

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
    <div className="space-y-6 animate-scaleIn">
      {/* --- FILTER SECTION WITH MODERN DESIGN --- */}
      <div className="glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
              {t("master_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("master_list_desc")}
            </p>
            <div className="h-0.5 w-16 bg-gradient-to-r from-cyan-500 to-emerald-500 mt-2 rounded-full" />
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={onAddType}
              className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
              title={t("add_new_master_item")}
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:shadow-md transition-all duration-200"
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
          className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-end ${
            isFilterOpen ? "grid" : "hidden md:grid"
          }`}
        >
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("search")}
            </label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder={t("search_master_item_placeholder")}
                className="w-full pl-10 pr-4 py-2.5 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("category")}
            </label>
            <select
              className="w-full py-2.5 px-3 border-2 rounded-xl text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer"
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
          <div className="hidden md:block">
            <label className="block text-xs font-medium mb-2 opacity-0">
              .
            </label>
            <button
              onClick={onAddType}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 text-sm font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>{t("add_new_master_item")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU DESKTOP --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hidden md:block border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3.5 text-left font-medium uppercase">
                  {t("master_item_name")}
                </th>
                <th className="px-4 py-3.5 text-left font-medium uppercase">
                  {t("category")}
                </th>
                <th className="px-4 py-3.5 text-left font-medium uppercase">
                  {t("usage_status")}
                </th>
                <th className="px-4 py-3.5 text-center font-medium uppercase">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const isModelInUse = fullEquipmentList.some(
                    (e) =>
                      e.name.split(" (User:")[0].trim() === item.name &&
                      e.category === item.category &&
                      e.status !== "master"
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
                      className={`transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        index % 2 === 0
                          ? "bg-gray-50/30 dark:bg-gray-900/20"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                        {item.name}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Layers className="w-3.5 h-3.5 text-gray-500" />
                          <span className="capitalize text-gray-700 dark:text-gray-300">
                            {(
                              categories.find((c) => c.id === item.category) ||
                              {}
                            ).name || item.category}
                          </span>
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 ${statusColor}`}>
                        {statusText}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onEditItem(item)}
                            disabled={isModelInUse}
                            className="p-2 rounded-lg text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title={
                              isModelInUse
                                ? t("cannot_edit_used_model")
                                : t("edit")
                            }
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title={t("delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-16">
                    <Package className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="mt-3 text-sm text-gray-500">
                      {t("no_master_items_found")}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- GIAO DIỆN CARD CHO MOBILE --- */}
      <div className="md:hidden space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isModelInUse = fullEquipmentList.some(
              (e) =>
                e.name.split(" (User:")[0].trim() === item.name &&
                e.category === item.category &&
                e.status !== "master"
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
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditItem(item)}
                      disabled={isModelInUse}
                      className="p-2 rounded-xl text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title={
                        isModelInUse ? t("cannot_edit_used_model") : t("edit")
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      title={t("delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div
                  className={`text-xs pt-3 mt-3 border-t dark:border-gray-700 ${statusColor}`}
                >
                  <span>
                    {t("usage_status")}: {statusText}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t("no_master_items_found")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterListView;
