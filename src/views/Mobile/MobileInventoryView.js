import React, { useState, useMemo } from "react";
import {
  Eye,
  Edit,
  LogOut,
  Trash2,
  User,
  Filter,
  Plus,
  ChevronDown,
  Check,
  Calendar,
} from "lucide-react";

const MobileInventoryView = ({
  equipment,
  unfilteredEquipment,
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString(t("locale_string"));
  };

  const renderCondition = (item) => {
    if (!item || !item.condition) return "---";
    if (typeof item.condition === "object" && item.condition.key) {
      return t(item.condition.key, item.condition.params);
    }
    return t(String(item.condition));
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSortChange = (sortKey) => {
    setFilters((prev) => {
      const currentDirection = prev.sortDirection || "desc";
      const newDirection =
        prev.sortKey === sortKey && currentDirection === "desc"
          ? "asc"
          : "desc";
      return { ...prev, sortKey, sortDirection: newDirection };
    });
    setIsSortOpen(false);
  };

  const uniqueStatuses = useMemo(() => {
    if (!unfilteredEquipment) return [];
    return [...new Set(unfilteredEquipment.map((item) => item.status))];
  }, [unfilteredEquipment]);

  const sortOptions = [
    { key: "importDate", label: t("import_date") },
    { key: "name", label: t("device_name") },
    { key: "status", label: t("status") },
  ];

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
              <div className="relative col-span-1">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  <span className="text-sm">{t("sort_by")}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isSortOpen && (
                  <div className="absolute z-10 top-full right-0 mt-2 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => handleSortChange(opt.key)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-between items-center"
                      >
                        {opt.label}
                        {filters.sortKey === opt.key && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                {categories.map((cat) => (
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
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status] || status}
                  </option>
                ))}
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
