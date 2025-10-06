import React, { useMemo, useState } from "react";
import {
  Eye,
  Edit,
  LogOut,
  Trash2,
  User,
  Filter,
  Plus,
  Calendar,
  Building,
} from "lucide-react";
import { useDynamicData } from "../../hooks/useDynamicData";
import EmptyState from "../../components/EmptyState";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { useAuth } from "../../hooks/useAuth";

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
  // Keep filters collapsed by default; user can expand when needed
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load dynamic department data for label resolution
  const { currentUser } = useAuth();
  const { departmentsList } = useDynamicData(currentUser);

  const getDepartmentLabel = (deptId) => {
    if (!deptId) return "N/A";
    const dept = (departmentsList || []).find((d) => d.id === deptId);
    if (dept) {
      if (dept.key) return t(dept.key);
      return dept.name || deptId;
    }
    return t(deptId) || deptId;
  };

  // Robust date formatter to avoid Safari parsing quirks
  const formatDate = (value) => {
    if (!value) return "---";
    // Normalize to Date instance first using safe parsing
    const d = (() => {
      // Firestore Timestamp
      if (value && typeof value === "object") {
        if (typeof value.toDate === "function") return value.toDate();
        if (typeof value.seconds === "number")
          return new Date(value.seconds * 1000);
        // Already a Date
        if (value instanceof Date) return value;
      }
      if (typeof value === "number") return new Date(value);
      if (typeof value === "string") {
        const s = value.trim();
        // yyyy-mm-dd (keep as local date components instead of relying on Date parsing)
        const isoDay = /^\d{4}-\d{2}-\d{2}$/;
        if (isoDay.test(s)) {
          const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
          return new Date(y, m - 1, d);
        }
        // dd/mm/yyyy or dd-mm-yyyy
        const dmySlash = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const dmyDash = /^(\d{2})-(\d{2})-(\d{4})$/;
        let m;
        if ((m = s.match(dmySlash))) {
          const [, dd, mm, yy] = m;
          return new Date(
            parseInt(yy, 10),
            parseInt(mm, 10) - 1,
            parseInt(dd, 10)
          );
        }
        if ((m = s.match(dmyDash))) {
          const [, dd, mm, yy] = m;
          return new Date(
            parseInt(yy, 10),
            parseInt(mm, 10) - 1,
            parseInt(dd, 10)
          );
        }
        // yyyy/mm/dd
        const ymdSlash = /^(\d{4})\/(\d{2})\/(\d{2})$/;
        if ((m = s.match(ymdSlash))) {
          const [, yy, mm, dd] = m;
          return new Date(
            parseInt(yy, 10),
            parseInt(mm, 10) - 1,
            parseInt(dd, 10)
          );
        }
        // Fallback to native parsing as last resort
        const nd = new Date(s);
        if (!Number.isNaN(nd.getTime())) return nd;
      }
      return null;
    })();

    if (!d || Number.isNaN(d.getTime())) return "---";
    return d.toLocaleDateString(t("locale_string"));
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
    (c) =>
      String(c.id).toLowerCase() !== "all" &&
      (c.name || "").toLowerCase() !== (t("all") || "").toLowerCase()
  );

  // sort helpers removed for mobile - using explicit importDate filter instead

  // Debounced search term for smoother UX on mobile
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  // Helpers
  // Normalize various possible date shapes to a stable local yyyy-mm-dd string
  const normalizeDateToYMD = (value) => {
    if (!value) return "";
    // Firestore Timestamp
    if (value && typeof value === "object") {
      if (typeof value.toDate === "function") {
        const d = value.toDate();
        if (d && !Number.isNaN(d.getTime())) {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${y}-${m}-${day}`;
        }
      }
      if (typeof value.seconds === "number") {
        const d = new Date(value.seconds * 1000);
        if (!Number.isNaN(d.getTime())) {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${y}-${m}-${day}`;
        }
      }
      if (value instanceof Date) {
        const d = value;
        if (!Number.isNaN(d.getTime())) {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${y}-${m}-${day}`;
        }
      }
    }
    if (typeof value === "number") {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      }
      return "";
    }
    if (typeof value === "string") {
      const s = value.trim();
      // yyyy-mm-dd → already normalized
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      // dd/mm/yyyy
      let m;
      if ((m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/))) {
        const [, dd, mm, yy] = m;
        return `${yy}-${mm}-${dd}`;
      }
      // dd-mm-yyyy
      if ((m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/))) {
        const [, dd, mm, yy] = m;
        return `${yy}-${mm}-${dd}`;
      }
      // yyyy/mm/dd
      if ((m = s.match(/^(\d{4})\/(\d{2})\/(\d{2})$/))) {
        const [, yy, mm, dd] = m;
        return `${yy}-${mm}-${dd}`;
      }
      // Fallback try native date
      const nd = new Date(s);
      if (!Number.isNaN(nd.getTime())) {
        const y = nd.getFullYear();
        const mm = String(nd.getMonth() + 1).padStart(2, "0");
        const dd = String(nd.getDate()).padStart(2, "0");
        return `${y}-${mm}-${dd}`;
      }
      return "";
    }
    return "";
  };

  // Apply local filters for mobile: search, category, status, importDate
  const filteredItems = useMemo(() => {
    let data = Array.isArray(equipment) ? equipment : [];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      data = data.filter(
        (it) =>
          (it.name || "").toLowerCase().includes(q) ||
          (it.serialNumber || "").toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== "all") {
      data = data.filter((it) => it.category === filters.category);
    }

    if (filters.status && filters.status !== "all") {
      data = data.filter((it) => it.status === filters.status);
    }

    if (filters.importDate) {
      data = data.filter(
        (it) => normalizeDateToYMD(it.importDate) === filters.importDate
      );
    }

    return data;
  }, [
    equipment,
    debouncedSearch,
    filters.category,
    filters.status,
    filters.importDate,
  ]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("inventory_list")}</h2>
            <p className="text-sm text-gray-500">{t("inventory_desc")}</p>
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
                className="w-full min-w-0 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 col-span-1"
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
                <option value="available">
                  {statusLabels.available || t("available")}
                </option>
                <option value="in-use">
                  {statusLabels["in-use"] || t("in_use")}
                </option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4 mobile-stagger">
        {filteredItems.map((item) => (
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{t("department")}:</span>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {getDepartmentLabel(item.allocationDetails?.department)}
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
        {filteredItems.length === 0 && (
          <EmptyState
            icon={Building}
            title={t("empty_inventory_title")}
            description={t("empty_inventory_text")}
          />
        )}
      </div>
      {/* Floating Add button to keep feature while matching header to Allocated */}
      <button
        onClick={onAddLegacyItem}
        className="fixed bottom-20 right-4 z-50 mobile-btn-primary rounded-full p-3 shadow-lg mobile-optimized"
        aria-label={t("import_unlisted_device")}
        title={t("import_unlisted_device")}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileInventoryView;
