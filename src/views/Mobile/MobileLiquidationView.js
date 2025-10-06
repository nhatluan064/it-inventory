import React, { useState, useMemo } from "react";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { Trash2, Filter, User, Wrench } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDynamicData } from "../../hooks/useDynamicData";

const MobileLiquidationView = ({ items, onLiquidateItem, t }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    department: "all",
    sortKey: "name",
    sortDirection: "asc",
  });

  const { currentUser } = useAuth();
  const { categories, departmentsList } = useDynamicData(currentUser);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const debouncedSearch = useDebouncedValue(filters.search, 300);

  const filteredAndSortedItems = useMemo(() => {
    let results = items.filter(
      (item) =>
        (item.name || "")
          .toLowerCase()
          .includes((debouncedSearch || "").toLowerCase()) ||
        (item.serialNumber || "")
          .toLowerCase()
          .includes((debouncedSearch || "").toLowerCase())
    );

    if (filters.category && filters.category !== "all") {
      results = results.filter((item) => item.category === filters.category);
    }

    if (filters.department && filters.department !== "all") {
      const dept = (departmentsList || []).find(
        (d) => d.id === filters.department
      );
      const targetName = (dept?.name || filters.department || "").toLowerCase();
      results = results.filter((item) => {
        const val = String(item.recalledDepartment || "").toLowerCase();
        return (
          val === targetName ||
          val.includes(targetName) ||
          item.recalledDepartment === filters.department
        );
      });
    }

    results.sort((a, b) => {
      const aVal = (a[filters.sortKey] || "").toString();
      const bVal = (b[filters.sortKey] || "").toString();
      const comparison = aVal.localeCompare(bVal, undefined, { numeric: true });
      return filters.sortDirection === "asc" ? comparison : -comparison;
    });

    return results;
  }, [
    items,
    debouncedSearch,
    filters.category,
    filters.department,
    filters.sortKey,
    filters.sortDirection,
    departmentsList,
  ]);

  const renderCondition = (item) => {
    if (!item) return "---";
    const cond = item.condition;
    if (!cond) return "---";
    // Prefer explicit note text if available (like desktop)
    const noteObj = cond?.params?.note;
    if (noteObj) {
      if (typeof noteObj === "object") {
        return noteObj.isKey ? t(noteObj.value) : noteObj.value;
      }
      return String(noteObj);
    }
    // Fallback: translate whole condition object or string
    if (typeof cond === "object" && cond.key) {
      const finalParams = { ...(cond.params || {}) };
      if (finalParams.note && typeof finalParams.note === "object") {
        const n = finalParams.note;
        finalParams.note = n.isKey ? t(n.value) : n.value;
      }
      return t(cond.key, finalParams);
    }
    try {
      return typeof cond === "object" ? JSON.stringify(cond) : t(String(cond));
    } catch {
      return String(cond);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      {/* Header và Bộ lọc */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("liquidation_list")}</h2>
            <p className="text-sm text-gray-500">{t("liquidation_desc")}</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="mobile-btn-icon mobile-optimized"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 animate-fadeIn">
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
            <div className="grid grid-cols-2 gap-4">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">{t("all")}</option>
                {(categories || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">{t("all")}</option>
                {(departmentsList || []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách Card */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {filteredAndSortedItems.length > 0 ? (
          filteredAndSortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3"
            >
              <div>
                <p className="font-bold text-base text-slate-600 dark:text-slate-400">
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
                    {renderCondition(item)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <User className="w-4 h-4" /> {t("recalled_from_user")}:
                  </span>
                  <span className="font-medium">
                    {item.recalledFrom || "---"}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-600 pt-3 flex justify-end">
                <button
                  onClick={() => onLiquidateItem(item)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  title={t("confirm_liquidated")}
                >
                  <Trash2 className="w-4 h-4" />
                  {t("confirm_liquidated")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 m-auto">
            <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-semibold">
              {t("liquidation_empty_title")}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {t("liquidation_empty_text")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileLiquidationView;
