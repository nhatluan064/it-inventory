// src/views/InventoryView.js
import React, { useMemo, useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Plus,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useSort, SortableHeader } from "../hooks/useSort";

const InventoryView = ({
  equipment,
  unfilteredEquipment,
  categories,
  statusColors,
  statusLabels,
  filters,
  setFilters,
  onEditItem,
  onDeleteItem,
  onViewItem,
  onAllocateItem,
  onAddLegacyItem,
  t,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const renderCondition = (item) => {
    if (!item.condition) return "---";
    if (typeof item.condition === "object" && item.condition.key) {
      const finalParams = { ...item.condition.params };
      if (finalParams.note && typeof finalParams.note === "object") {
        const noteObject = finalParams.note;
        finalParams.note = noteObject.isKey
          ? t(noteObject.value)
          : noteObject.value;
      }
      return t(item.condition.key, finalParams);
    }
    const conditionText = t(String(item.condition));
    return item.isRecalled
      ? t("recalled_prefix", { conditionText })
      : conditionText;
  };

  const equipmentWithSortableCondition = useMemo(
    () =>
      equipment.map((item) => ({
        ...item,
        conditionText: renderCondition(item),
      })),
    [equipment, t]
  );

  const {
    items: sortedEquipment,
    requestSort,
    sortConfig,
  } = useSort(equipmentWithSortableCondition, {
    key: "importDate",
    direction: "descending",
  });

  const columns = [
    { key: "importDate", label: "import_date", sortable: true },
    { key: "name", label: "device_name", sortable: true },
    { key: "serialNumber", label: "serial_number_sn", sortable: true },
    { key: "category", label: "category", sortable: true },
    { key: "status", label: "status", sortable: true },
    { key: "conditionText", label: "condition", sortable: true },
    { key: "price", label: "price", sortable: true, className: "text-right" },
    { key: "location", label: "location", sortable: true },
    {
      key: "actions",
      label: "actions",
      sortable: false,
      className: "text-center",
    },
  ];

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "N/A";
    return new Intl.NumberFormat(t("locale_string"), {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(t("locale_string"));
  };

  const categoryCounts = (
    Array.isArray(unfilteredEquipment) ? unfilteredEquipment : []
  ).reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const uniqueStatuses = useMemo(
    () => [...new Set(unfilteredEquipment.map((item) => item.status))],
    [unfilteredEquipment]
  );
  const uniqueConditions = useMemo(() => {
    const conditions = new Map();
    unfilteredEquipment.forEach((item) => {
      if (!item.condition) return;
      const key =
        typeof item.condition === "object"
          ? item.condition.key
          : item.condition;
      if (key && !conditions.has(key)) {
        conditions.set(key, renderCondition(item));
      }
    });
    return Array.from(conditions.entries());
  }, [unfilteredEquipment, t]);
  const uniqueLocations = useMemo(
    () => [...new Set(unfilteredEquipment.map((item) => item.location))],
    [unfilteredEquipment]
  );

  const AddNewButton = () => (
    <div className="flex items-center justify-center">
      <button
        onClick={onAddLegacyItem}
        className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900"
        title={t("import_unlisted_device")}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {t("inventory_list")}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("inventory_desc")}
            </p>
          </div>
          {/* Sửa: md:hidden -> lg:hidden */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
            >
              {isMobileFilterOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <SlidersHorizontal className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end
            ${isMobileFilterOpen ? "grid" : "hidden lg:grid"}
        `}
        >
          <div>
            <label className="block text-xs font-medium mb-1">
              {t("import_date")}
            </label>
            <input
              name="importDate"
              type="date"
              className="w-full py-2 px-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
              value={filters.importDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 xl:col-span-2">
            <label className="block text-xs font-medium mb-1">
              {t("search")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="search"
                type="text"
                placeholder={t("search_inventory_placeholder")}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 text-sm"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              {t("category")}
            </label>
            <select
              name="category"
              className="w-full py-2 px-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat) => {
                const count =
                  cat.id === "all"
                    ? unfilteredEquipment.length
                    : categoryCounts[cat.id] || 0;
                return (
                  <option
                    key={cat.id}
                    value={cat.id}
                  >{`${cat.name} (${count})`}</option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              {t("status")}
            </label>
            <select
              name="status"
              className="w-full py-2 px-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">{t("all")}</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status] || status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              {t("condition")}
            </label>
            <select
              name="condition"
              className="w-full py-2 px-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
              value={filters.condition}
              onChange={handleFilterChange}
            >
              <option value="all">{t("all")}</option>
              {uniqueConditions.map(([key, text]) => (
                <option key={key} value={key}>
                  {text}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <SortableHeader
              columns={columns}
              requestSort={requestSort}
              sortConfig={sortConfig}
              t={t}
            />
            <tbody className="divide-y dark:divide-gray-700">
              {sortedEquipment && sortedEquipment.length > 0 ? (
                <>
                  {sortedEquipment.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-3 py-4">
                        {formatDate(item.importDate)}
                      </td>
                      <td className="px-3 py-4 font-medium">{item.name}</td>
                      <td className="px-3 py-4 font-mono">
                        {item.serialNumber || "N/A"}
                      </td>
                      <td className="px-3 py-4 capitalize">
                        {(categories.find((c) => c.id === item.category) || {})
                          .name || item.category}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[item.status] || "bg-gray-100"
                          }`}
                        >
                          {statusLabels[item.status] || item.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">{renderCondition(item)}</td>
                      <td className="px-3 py-4 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-3 py-4">
                        {t(item.location) || t("in_stock")}
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onAllocateItem(item)}
                            className="p-2 text-blue-600 hover:text-blue-400"
                            title={t("allocate_device")}
                            disabled={item.status !== "available"}
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewItem(item)}
                            className="p-2 text-green-600 hover:text-green-400"
                            title={t("view")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-2 text-yellow-600 hover:text-yellow-400"
                            title={t("edit")}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item)}
                            className="p-2 text-red-600 hover:text-red-400"
                            title={t("delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={columns.length} className="py-4">
                      <AddNewButton />
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    <p>{t("no_devices_match_search")}</p>
                    <div className="mt-4">
                      <AddNewButton />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
