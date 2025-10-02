import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Wrench,
  Filter,
  User,
  Building,
  Calendar,
  Edit,
  Eye,
} from "lucide-react";
import { useDynamicData } from "../../hooks/useDynamicData";
import { useAuth } from "../../hooks/useAuth";

const MobileAllocatedView = ({
  items,
  onRecallItem,
  onMarkDamaged,
  onEditAllocation,
  onViewItem,
  t,
  filters,
  setFilters,
}) => {
  const { currentUser } = useAuth();
  const { departmentsList, categories, positionsList } = useDynamicData(currentUser);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get categories from dynamic data hook and filter out any placeholder 'all'
  const cleanedCategories = (categories || []).filter(
    (c) => String(c.id).toLowerCase() !== "all" && (c.name || "").toLowerCase() !== (t("all") || "").toLowerCase()
  );

  const getDepartmentLabel = (deptId) => {
    if (!deptId) return "N/A";
    const dept = (departmentsList || []).find((d) => d.id === deptId);
    if (dept) {
      // Prefer explicit display name from the department record.
      // If a translation key is provided on the department, use it; otherwise return the stored name.
      if (dept.key) return t(dept.key);
      return dept.name || deptId;
    }
    // If department not found in list, try translating the id (it might be a translation key)
    return t(deptId) || deptId;
  };

  const getPositionLabel = (posId) => {
    if (!posId) return "N/A";
    const pos = (positionsList || []).find((p) => p.id === posId);
    if (pos) return pos.name || posId;
    return t(posId) || posId;
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const formatDate = (dateString) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString(t("locale_string"));
  };

  const filteredAndSortedItems = useMemo(() => {
    let sortedItems = [...items]; // items are already filtered by App.js
    const { sortKey, sortDirection } = filters;

    if (sortKey) {
      sortedItems.sort((a, b) => {
        const getNestedValue = (obj, key) =>
          key.split(".").reduce((o, i) => (o ? o[i] : undefined), obj);
        const aVal = getNestedValue(a, sortKey) || "";
        const bVal = getNestedValue(b, sortKey) || "";
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: "base",
        });
        const comparison = collator.compare(aVal.toString(), bVal.toString());
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }
    return sortedItems;
  }, [items, filters]);


  // departmentOptions no longer needed for mobile allocated view (using category filter instead)

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("allocated_list")}</h2>
            <p className="text-sm text-gray-500">{t("allocated_desc")}</p>
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
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />

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
                name="department"
                value={filters.department || "all"}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">{t("all")}</option>
                {(departmentsList || []).map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <input
                name="handoverDate"
                type="date"
                value={filters.handoverDate || ""}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 mobile-stagger">
        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3 mobile-card"
          >
            <div>
              <p className="font-bold text-base">{item.name}</p>
              <p className="text-xs font-mono text-gray-500">
                {item.serialNumber || "N/A"}
              </p>
            </div>
            <div className="border-t dark:border-gray-600 pt-3 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("recipient")}:</span>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="font-medium">
                      {item.allocationDetails?.recipientName}
                    </span>
                    <div className="text-xs text-gray-500">
                      {item.allocationDetails?.position
                        ? getPositionLabel(item.allocationDetails.position)
                        : ""}
                    </div>
                  </div>
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
              <div className="flex justify-between">
                <span className="text-gray-500">{t("handover_date")}:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {formatDate(item.allocationDetails?.handoverDate)}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t dark:border-gray-600 pt-3 flex justify-end space-x-2">
              <button
                onClick={() => onViewItem && onViewItem(item)}
                className="mobile-btn-icon mobile-optimized"
                title={t("view_info")}
              >
                <Eye className="w-5 h-5 text-blue-500" />
              </button>
              <button
                onClick={() => onEditAllocation(item)}
                className="mobile-btn-icon mobile-optimized"
                title={t("edit_recipient")}
              >
                <Edit className="w-5 h-5 text-blue-500" />
              </button>
              <button
                onClick={() => onRecallItem(item)}
                className="mobile-btn-icon mobile-optimized"
              >
                <RotateCcw className="w-5 h-5 text-green-500" />
              </button>
              <button
                onClick={() => onMarkDamaged(item)}
                className="mobile-btn-icon mobile-optimized"
              >
                <Wrench className="w-5 h-5 text-orange-500" />
              </button>
            </div>
          </div>
        ))}
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {t("no_allocated_items_match_filter")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAllocatedView;
