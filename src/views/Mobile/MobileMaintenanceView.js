import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Edit,
  Filter,
  Calendar,
  Wrench,
  User,
} from "lucide-react";

const MobileMaintenanceView = ({
  items,
  onRepairComplete,
  onMarkUnrepairable,
  onEditNote,
  t,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "" });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleString(t("locale_string"));
  };

  const renderCondition = (condition) => {
    if (!condition) return "---";
    if (typeof condition === "object") {
      // expected shape: { key: 'translation.key', params: { ... } }
      if (condition.key) {
        const finalParams = { ...(condition.params || {}) };
        if (finalParams.note && typeof finalParams.note === "object") {
          const noteObj = finalParams.note;
          finalParams.note = noteObj.isKey ? t(noteObj.value) : noteObj.value;
        }
        return t(condition.key, finalParams || {});
      }
      // fallback to JSON string if no key
      try {
        return JSON.stringify(condition);
      } catch (e) {
        return String(condition);
      }
    }
    return t(String(condition));
  };

  const filteredAndSortedItems = useMemo(() => {
    let results = items.filter(
      (item) =>
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.serialNumber?.toLowerCase().includes(filters.search.toLowerCase())
    );

    results.sort((a, b) => {
      const aVal = a[filters.sortKey] || "";
      const bVal = b[filters.sortKey] || "";
      const comparison = new Date(bVal) - new Date(aVal); // Sort dates correctly
      return filters.sortDirection === "asc" ? -comparison : comparison;
    });

    return results;
  }, [items, filters]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      {/* Header và Bộ lọc */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("maintenance_management")}</h2>
            <p className="text-sm text-gray-500">{t("maintenance_desc")}</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mobile-btn-icon mobile-optimized"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 mobile-filter-enter">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("search")}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 col-span-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Danh sách Card */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 mobile-stagger">
        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3 mobile-card"
          >
            <div>
              <p className="font-bold text-base text-orange-600 dark:text-orange-400">
                {item.name}
              </p>
              <p className="text-xs font-mono text-gray-500">
                {item.serialNumber || "N/A"}
              </p>
            </div>

            <div className="border-t dark:border-gray-600 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <Wrench className="w-4 h-4" /> {t("failure_note")}:
                </span>
                <span className="font-medium text-right">
                  {renderCondition(item.condition)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {t("maintenance_date")}:
                </span>
                <span className="font-medium">
                  {formatDate(item.maintenanceDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <User className="w-4 h-4" /> {t("recalled_from_user")}:
                </span>
                <span className="font-medium text-right">
                  {(item.recalledFrom || "---") +
                    (item.recalledDepartment
                      ? ` • ${item.recalledDepartment}`
                      : "")}
                </span>
              </div>
            </div>

            <div className="border-t dark:border-gray-600 pt-3 flex justify-end space-x-2">
              <button
                onClick={() => onEditNote(item)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title={t("edit_failure_note")}
              >
                <Edit className="w-5 h-5 text-blue-500" />
              </button>
              <button
                onClick={() => onRepairComplete(item)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title={t("repair_completed")}
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
              </button>
              <button
                onClick={() => onMarkUnrepairable(item)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title={t("mark_unrepairable")}
              >
                <XCircle className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">{t("no_data_available")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMaintenanceView;
