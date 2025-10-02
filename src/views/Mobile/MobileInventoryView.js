import React, { useState } from "react";
import {
  Eye,
  Edit,
  LogOut,
  Trash2,
  User,
  Filter,
  Plus,
  Calendar,
} from "lucide-react";

const MobileInventoryView = ({
  equipment,
  categories,
  statusLabels,
  filters,
  setFilters,
  onViewItem,
  onEditItem,
  onAllocateItem,
  onDeleteItem,
  onAddLegacyItem,
  t,
}) => {
  // Keep filters visible on mobile by default
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString(t("locale_string"));
  };

  const renderCondition = (item) => {
    if (!item || !item.condition) return "---";
    if (typeof item.condition === "object") {
      // If condition is a translation key with params, ensure note param is a string
      if (item.condition.key) {
        const finalParams = { ...(item.condition.params || {}) };
        if (finalParams.note && typeof finalParams.note === "object") {
          const noteObj = finalParams.note;
          finalParams.note = noteObj.isKey ? t(noteObj.value) : noteObj.value;
        }
        return t(item.condition.key, finalParams);
      }
      // Fallback to safe stringification
      try {
        return JSON.stringify(item.condition);
      } catch (e) {
        return String(item.condition);
      }
    }
    return t(String(item.condition));
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  // uniqueStatuses not needed after restricting status dropdown to fixed options

  // Filter out any category placeholders named or keyed 'all' to avoid duplicate "All" options
  const cleanedCategories = (categories || []).filter(
    (c) => String(c.id).toLowerCase() !== "all" && (c.name || "").toLowerCase() !== (t("all") || "").toLowerCase()
  );

  // sort helpers removed for mobile - using explicit importDate filter instead

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("inventory_list")}</h2>
            <p className="text-sm text-gray-500">{t("inventory_desc")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="mobile-btn-icon mobile-optimized"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={onAddLegacyItem}
              className="mobile-btn-primary rounded-full p-2 mobile-optimized"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        {isFilterOpen && (
          <div className="mt-4 space-y-4 mobile-filter-enter">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("search_inventory_placeholder")}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 col-span-1"
              />
              <input
                type="date"
                name="importDate"
                value={filters.importDate || ""}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 col-span-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">{t("all")}</option>
                {cleanedCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">{t("all")}</option>
                <option value="available">{statusLabels.available || t("available")}</option>
                <option value="in-use">{statusLabels["in-use"] || t("in_use")}</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4 mobile-stagger">
        {equipment.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3 mobile-card"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-base text-blue-600 dark:text-blue-400">
                  {item.name}
                </p>
                <p className="text-xs font-mono text-gray-500">
                  {item.serialNumber || "N/A"}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  item.status === "in-use"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                }`}
              >
                {statusLabels[item.status] || item.status}
              </span>
            </div>

            <div className="border-t dark:border-gray-600 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t("condition")}:</span>
                <span className="font-medium">{renderCondition(item)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("import_date")}:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {formatDate(item.importDate)}
                  </span>
                </div>
              </div>
              {/* Bổ sung Ngày xuất kho (bàn giao) */}
              <div className="flex justify-between">
                <span className="text-gray-500">{t("handover_date")}:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {formatDate(item.allocationDetails?.handoverDate)}
                  </span>
                </div>
              </div>
              {item.status === "in-use" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{t("user_in_use")}:</span>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {item.allocationDetails?.recipientName}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="border-t dark:border-gray-600 pt-3 flex justify-end space-x-2">
              <button
                onClick={() => onViewItem(item)}
                className="mobile-btn-icon mobile-optimized"
              >
                <Eye className="w-5 h-5 text-emerald-500" />
              </button>
              <button
                onClick={() => onEditItem(item)}
                className="mobile-btn-icon mobile-optimized"
              >
                <Edit className="w-5 h-5 text-amber-500" />
              </button>
              <button
                disabled={item.status !== "available"}
                onClick={() => onAllocateItem(item)}
                className="mobile-btn-icon mobile-optimized disabled:opacity-50"
              >
                <LogOut className="w-5 h-5 text-blue-500" />
              </button>
              <button
                onClick={() => onDeleteItem(item)}
                className="mobile-btn-icon mobile-optimized"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
        {equipment.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">{t("no_devices_match_search")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileInventoryView;
