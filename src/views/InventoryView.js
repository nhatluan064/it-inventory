import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Plus,
  User,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Package,
  Calendar,
  MapPin,
  Download,
} from "lucide-react";
import { useSort } from "../hooks/useSort";
import { AnimatedButton } from "../components/AnimatedButton";
import { CSVLink } from "react-csv";
import EmptyState from "../components/EmptyState";

const InventoryView = ({
  equipment,
  unfilteredEquipment,
  categories,
  statusLabels,
  filters,
  setFilters,
  onEditItem,
  onDeleteItem,
  onViewItem,
  onAllocateItem,
  onAddLegacyItem,
  departmentsList,
  t,
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [, setAnimatingRows] = useState({});
  const [subSortConfigs, setSubSortConfigs] = useState({});
  // Handler để đảo chiều sort cho từng nhóm category
  const handleSubSortToggle = (categoryId) => {
    setSubSortConfigs((prev) => {
      const prevConfig = prev[categoryId] || { key: "name", direction: "ascending" };
      return {
        ...prev,
        [categoryId]: {
          ...prevConfig,
          direction: prevConfig.direction === "ascending" ? "descending" : "ascending",
        },
      };
    });
  };

  // State để quản lý sorting category riêng
  const [categorySortConfig, setCategorySortConfig] = useState({
    key: "category",
    direction: "ascending",
  });

  const { items: sortedItems } = useSort(equipment, {
    key: "name",
    direction: "ascending",
  });

  // Handler riêng cho category sort
  // eslint-disable-next-line no-unused-vars
  const handleCategorySort = () => {
    setCategorySortConfig((prev) => ({
      key: "category",
      direction: prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const groupedByCategory = useMemo(() => {
    const grouped = sortedItems.reduce((acc, item) => {
      const key = item.category || "uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    // Sắp xếp các categories theo thứ tự
    const sortedGrouped = {};
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
      const aName = categories.find((c) => c.id === a)?.name || a;
      const bName = categories.find((c) => c.id === b)?.name || b;
      const comparison = aName.localeCompare(bName);
      return categorySortConfig.direction === "ascending"
        ? comparison
        : -comparison;
    });


    // Sort từng nhóm theo tên thiết bị từ A-Z
    sortedCategories.forEach((categoryId) => {
      sortedGrouped[categoryId] = grouped[categoryId].slice().sort((a, b) => {
        if (!a.name) return 1;
        if (!b.name) return -1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });
    });

    return sortedGrouped;
  }, [sortedItems, categories, categorySortConfig]);

  // Reset expanded rows when filters change
  useEffect(() => {
    setExpandedRows({});
    setAnimatingRows({});
  }, [filters]);

  // Reset expanded rows when category filter changes specifically
  useEffect(() => {
    setExpandedRows({});
    setAnimatingRows({});
  }, [filters.category]);

  const categoryCounts = useMemo(() => {
    if (!unfilteredEquipment) return {};
    return unfilteredEquipment.reduce((acc, item) => {
      if (item && item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
      return acc;
    }, {});
  }, [unfilteredEquipment]);

  // Note: status options limited to Available and In Use per product requirement

  // Helper: resolve department name (avoid exporting raw id like dept_it)
  const getDepartmentName = useCallback(
    (deptId) => {
      if (!deptId) return "";
      const dept = departmentsList?.find((d) => d.id === deptId);
      if (dept?.name) return dept.name;
      // Some legacy data may store a key (e.g., dept_cong_nghe_thong_tin_erp_it) or already plain text
      // Try translation first (if a translation key exists), else clean up slug-like strings to readable form.
      const maybeTranslated = t(deptId);
      if (maybeTranslated && maybeTranslated !== deptId) return maybeTranslated;
      // Convert slug to Title Case Vietnamese-friendly: replace underscores with spaces
      if (deptId.includes("_")) {
        return deptId
          .replace(/^dept[_-]?/, "")
          .split(/[_-]+/)
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
      return deptId; // final fallback
    },
    [departmentsList, t]
  );

  // CSV Export Data: MUST mirror what user sees in this Inventory screen.
  // => Only include items with status 'available' or 'in-use' (exclude maintenance etc.)
  // => Export translated status & real department name (not raw id) for allocated devices.
  const exportData = useMemo(() => {
    const source = (unfilteredEquipment || []).filter((item) =>
      ["available", "in-use"].includes(item.status)
    );
    return source.map((item) => ({
      name: item.name,
      serialNumber: item.serialNumber || "",
      status: statusLabels[item.status] || t(item.status) || item.status,
      category:
        categories.find((c) => c.id === item.category)?.name ||
        item.category ||
        "",
      importDate: item.importDate
        ? new Date(item.importDate).toLocaleString(t("locale_string"))
        : "",
      handoverDate: item.allocationDetails?.handoverDate
        ? new Date(item.allocationDetails.handoverDate).toLocaleString(
            t("locale_string")
          )
        : "",
      recipient: item.allocationDetails?.recipientName || "",
      // Only show department name when device is in-use & has department
      department:
        item.status === "in-use"
          ? getDepartmentName(item.allocationDetails?.department)
          : "",
    }));
  }, [unfilteredEquipment, statusLabels, categories, t, getDepartmentName]);

  const formatDateDMY = (dateString) => {
    if (!dateString) return "---";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "---";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const toggleExpand = (name) => {
    const isExpanded = expandedRows[name];
    if (isExpanded) {
      setAnimatingRows((prev) => ({ ...prev, [name]: "closing" }));
      setTimeout(() => {
        setExpandedRows((prev) => ({ ...prev, [name]: false }));
        setAnimatingRows((prev) => ({ ...prev, [name]: undefined }));
      }, 300);
    } else {
      // Close all others and open only the selected one
      setExpandedRows({ [name]: true });
      setAnimatingRows((prev) => ({ ...prev, [name]: "opening" }));
    }
  };

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
  <div className="h-full flex flex-col gap-4 animate-fadeIn text-sm">
      {/* Page transition / Filter section */}
  <div className="card card-lg glass-effect animate-slideInDown p-3">
        {/* Filter section animation */}
  <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {t("inventory_list")}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("inventory_desc")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedButton
              onClick={onAddLegacyItem}
              variant="primary"
              className="flex items-center space-x-1 text-xs font-semibold px-2 py-1"
            >
              <Plus className="w-4 h-4" />
              <span>{t("import_unlisted_device")}</span>
            </AnimatedButton>
            {/* Download all inventory CSV (in-use + in-stock) */}
            <CSVLink
              data={exportData}
              headers={[
                { label: t("device_name"), key: "name" },
                { label: t("serial_number_sn"), key: "serialNumber" },
                { label: t("status"), key: "status" },
                { label: t("category"), key: "category" },
                { label: t("import_date"), key: "importDate" },
                { label: t("handover_date"), key: "handoverDate" },
                { label: t("recipient"), key: "recipient" },
                { label: t("department"), key: "department" },
              ]}
              filename="inventory_devices.csv"
              className="p-2 bg-green-100 dark:bg-green-700/50 rounded-lg text-green-600 dark:text-green-300 animate-hoverScale transition-all duration-200"
            >
              <Download className="w-4 h-4" />
            </CSVLink>
          </div>
        </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 items-end text-xs">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-0.5">
              {t("search")}
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                name="search"
                type="text"
                placeholder={t("search_inventory_placeholder")}
                className="w-full pl-7 pr-2 py-1 border rounded text-xs dark:bg-gray-700/50 dark:border-gray-600 h-7"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-0.5">
              {t("category")}
            </label>
            <select
              name="category"
              className="w-full py-1 px-2 border rounded text-xs dark:bg-gray-700/50 dark:border-gray-600 h-7"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{`${cat.name} (${
                  cat.id === "all"
                    ? unfilteredEquipment.length
                    : (categoryCounts && categoryCounts[cat.id]) || 0
                })`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-0.5">
              {t("status")}
            </label>
            <select
              name="status"
              className="w-full py-1 px-2 border rounded text-xs dark:bg-gray-700/50 dark:border-gray-600 h-7"
              value={filters.status}
              onChange={handleFilterChange}
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
          <div>
            <label className="block text-xs font-semibold mb-0.5">
              {t("import_date")}
            </label>
            <input
              name="importDate"
              type="date"
              className="w-full py-1 px-2 border rounded text-xs dark:bg-gray-700/50 dark:border-gray-600 h-7"
              value={filters.importDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col card animate-slideInUp card-lg overflow-hidden">
        {/* Card-based container */}
        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-3">
          {Object.keys(groupedByCategory).length === 0 && (
            <EmptyState
              icon={MapPin}
              title={t("empty_inventory_title")}
              description={t("empty_inventory_text")}
            />
          )}
          {Object.entries(groupedByCategory).map(
            ([categoryId, items], catIndex) => {
              const isExpanded = expandedRows[categoryId];
              const category = categories.find((c) => c.id === categoryId);
              const subSortConfig = subSortConfigs[categoryId] || {
                key: "name",
                direction: "ascending",
              };
              const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
              const sortedSubItems = [...items].sort((a, b) => {
                const aName = a.name || "";
                const bName = b.name || "";
                const nameCompare = collator.compare(aName, bName);
                if (nameCompare !== 0) {
                  return subSortConfig.direction === "ascending" ? nameCompare : -nameCompare;
                }
                // Nếu tên giống nhau, sort theo số cuối của serialNumber
                const getLastNumber = (sn) => {
                  if (!sn) return -1;
                  const match = sn.match(/(\d+)(?!.*\d)/);
                  return match ? parseInt(match[1], 10) : -1;
                };
                const aSN = getLastNumber(a.serialNumber);
                const bSN = getLastNumber(b.serialNumber);
                if (aSN === bSN) return 0;
                return subSortConfig.direction === "ascending" ? aSN - bSN : bSN - aSN;
              });

              return (
                <div
                  key={categoryId}
                  className="border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden animate-fadeIn"
                  style={{ animationDelay: `${catIndex * 0.05}s` }}
                >
                  {/* Category Header with Blue Gradient */}
                  <div
                    onClick={() => toggleExpand(categoryId)}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-white" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs text-gray-900 dark:text-white">
                          {category?.name || categoryId}
                        </h3>
                        {/* Button sort tên thiết bị A-Z/Z-A */}
                        <button
                          type="button"
                          className="ml-1 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                          title={subSortConfig.direction === "ascending" ? "Sắp xếp A-Z" : "Sắp xếp Z-A"}
                          onClick={e => {
                            e.stopPropagation();
                            handleSubSortToggle(categoryId);
                          }}
                        >
                          {subSortConfig.direction === "ascending" ? (
                            <ArrowDown className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
                          )}
                        </button>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {items.length} {t("label_devices")}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      <span className="text-xs font-medium">{isExpanded ? t("collapse") : t("expand")}</span>
                    </div>
                  </div>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                      {sortedSubItems.map((item, itemIndex) => {
                        const isInUse = item.status === "in-use";
                        return (
                          <div
                            key={item.id}
                            className={`grid grid-cols-12 items-center p-4 md:gap-x-4 lg:gap-x-6 xl:gap-x-8 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-slideInLeft border-l-4 border-transparent hover:border-blue-400 dark:hover:border-blue-500 ${
                              isInUse ? "bg-blue-50 dark:bg-blue-900/20" : ""
                            }`}
                            style={{
                              animationDelay: `${itemIndex * 0.03}s`,
                            }}
                          >
                            {/* Device Info (4) */}
                            <div className="col-span-12 md:col-span-5 lg:col-span-4 flex items-center gap-3 min-w-0">
                              <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full flex-shrink-0"></div>
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-400 dark:from-blue-500 dark:to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                                  <Package className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`font-medium truncate ${
                                      isInUse
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-900 dark:text-white"
                                    }`}
                                  >
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
                                    SN: {item.serialNumber || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Dates (1) - keep only import date on the left */}
                            <div className="col-span-6 md:col-span-2 lg:col-span-2 text-xs text-gray-500 dark:text-gray-400 min-w-0 mt-2 md:mt-0 pr-2 lg:pr-4">
                              <div
                                className="flex items-center gap-2 truncate"
                                title={`${t(
                                  "import_date_short"
                                )}: ${formatDateDMY(item.importDate)}`}
                              >
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="truncate">
                                  {t("import_date_short")}:{" "}
                                  {formatDateDMY(item.importDate)}
                                </span>
                              </div>
                            </div>

                            {/* User (3) + Department/Location stacked */}
                            <div className="col-span-12 md:col-span-3 lg:col-span-2 min-w-0 mt-2 md:mt-0 lg:pl-4">
                              {isInUse ? (
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 min-w-0">
                                  <User className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-sm truncate">
                                    {item.allocationDetails?.recipientName}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500 italic truncate">
                                  {t("user_not_use")}
                                </span>
                              )}
                              <div className="flex items-center gap-2 truncate mt-1 text-xs text-gray-600 dark:text-gray-300">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span
                                  className="truncate whitespace-nowrap"
                                  title={
                                    item.status === "in-use" &&
                                    item.allocationDetails?.department
                                      ? departmentsList?.find(
                                          (dept) =>
                                            dept.id ===
                                            item.allocationDetails.department
                                        )?.name ||
                                        t(item.allocationDetails.department) ||
                                        item.allocationDetails.department
                                      : t("location_in_stock")
                                  }
                                >
                                  {item.status === "in-use" &&
                                  item.allocationDetails?.department
                                    ? departmentsList?.find(
                                        (dept) =>
                                          dept.id ===
                                          item.allocationDetails.department
                                      )?.name ||
                                      t(item.allocationDetails.department) ||
                                      item.allocationDetails.department
                                    : t("location_in_stock")}
                                </span>
                              </div>
                            </div>

                            {/* Handover Date (right) - separate from Department */}
                            <div className="col-span-6 md:col-span-2 lg:col-span-2 text-xs text-gray-500 dark:text-gray-400 min-w-0 mt-2 md:mt-0 pl-16">
                              <div
                                className="flex items-center gap-2 truncate"
                                title={`${t(
                                  "export_date_short"
                                )}: ${formatDateDMY(
                                  item.allocationDetails?.handoverDate
                                )}`}
                              >
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="truncate">
                                  {t("export_date_short")}:{" "}
                                  {formatDateDMY(
                                    item.allocationDetails?.handoverDate
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Actions (2) */}
                            <div className="col-span-12 md:col-span-12 lg:col-span-2 flex items-center justify-end gap-2 mt-3 lg:mt-0 shrink-0">
                              <button
                                onClick={() => onAllocateItem(item)}
                                disabled={item.status !== "available"}
                                className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 disabled:opacity-30"
                                title={t("allocate")}
                              >
                                <LogOut className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onViewItem(item)}
                                className="p-2 text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-all duration-200"
                                title={t("view")}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onEditItem(item)}
                                className="p-2 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                                title={t("edit")}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteItem(item)}
                                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                                title={t("delete")}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
