// src/views/InventoryView.js
import React, { useMemo, useState, useCallback } from "react";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Plus,
  SlidersHorizontal,
  X,
  User,
  CirclePlus,
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

  const renderCondition = useCallback(
    (item) => {
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
    },
    [t]
  );

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "N/A";
    return new Intl.NumberFormat(t("locale_string"), {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(t("locale_string"), {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const equipmentWithSortableCondition = useMemo(
    () =>
      equipment.map((item) => ({
        ...item,
        conditionText: renderCondition(item),
      })),
    [equipment, renderCondition]
  );
  const {
    items: sortedEquipment,
    requestSort,
    sortConfig,
  } = useSort(equipmentWithSortableCondition, {
    key: "importDate",
    direction: "descending",
  });

  const columns = useMemo(
    () => [
      { key: "importDate", label: "import_date", sortable: true, className: "min-w-[140px]" },
      { key: "name", label: "device_name", sortable: true, className: "min-w-[250px] w-1/6" },
      { key: "serialNumber", label: "serial_number_sn", sortable: true, className: "min-w-[150px]" },
      { key: "category", label: "category", sortable: true, className: "min-w-[120px]" },
      { key: "status", label: "status", sortable: true, className: "text-center min-w-[120px]" },
      { key: "user", label: "user_in_use", sortable: true, className: "min-w-[150px]" },
      { key: "conditionText", label: "condition", sortable: true, className: "min-w-[200px]" },
      { key: "price", label: "price", sortable: true, className: "text-right min-w-[100px]" },
      { key: "location", label: "location", sortable: true, className: "min-w-[120px]" },
      { key: "actions", label: "actions", sortable: false, className: "text-center min-w-[120px]" },
    ],
    [t]
  );

  const categoryCounts = useMemo(
    () =>
      (Array.isArray(unfilteredEquipment) ? unfilteredEquipment : []).reduce(
        (acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        },
        {}
      ),
    [unfilteredEquipment]
  );

  const uniqueStatuses = useMemo(
    () => [...new Set(unfilteredEquipment.map((item) => item.status))],
    [unfilteredEquipment]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* --- BỘ LỌC VÀ TIÊU ĐỀ --- */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {t("inventory_list")}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("inventory_desc")}
            </p>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onAddLegacyItem}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
              title={t("import_unlisted_device")}
            >
              <CirclePlus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
            >
              {isMobileFilterOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <SlidersHorizontal className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end ${
            isMobileFilterOpen ? "grid" : "hidden md:grid"
          }`}
        >
          <div className="sm:col-span-2 lg:col-span-4 xl:col-span-2">
            <label className="block text-xs font-medium mb-1">
              {t("search")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="search"
                type="text"
                placeholder={t("search_inventory_placeholder")}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
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
              className="w-full py-2 px-3 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{`${cat.name} (${
                  cat.id === "all"
                    ? unfilteredEquipment.length
                    : categoryCounts[cat.id] || 0
                })`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              {t("status")}
            </label>
            <select
              name="status"
              className="w-full py-2 px-3 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
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
              {t("import_date")}
            </label>
            <input
              name="importDate"
              type="date"
              className="w-full py-2 px-3 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={filters.importDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="hidden md:block">
            <label className="block text-xs font-medium mb-1 opacity-0">
              .
            </label>
            <button
              onClick={onAddLegacyItem}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 text-xs font-semibold"
            >
              <Plus className="w-4 h-6" />
              <span>{t("import_unlisted_device")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU DESKTOP --- */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="text-left w-full text-xs">
            <SortableHeader
              columns={columns}
              requestSort={requestSort}
              sortConfig={sortConfig}
              t={t}
            />
            <tbody className="divide-y dark:divide-gray-700">
              {sortedEquipment && sortedEquipment.length > 0 ? (
                sortedEquipment.map((item) => (
                  <tr
                    key={item.id}
                    className="text-left hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-3 py-4">{formatDate(item.importDate)}</td>
                    <td className="px-3 py-4 font-medium">{item.name}</td>
                    <td className="px-3 py-4 font-mono">{item.serialNumber || "N/A"}</td>
                    <td className="px-3 py-4 capitalize">{(categories.find((c) => c.id === item.category) || {}).name || item.category}</td>
                    <td className="px-3 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status] || "bg-gray-100"}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 font-semibold">
                      {item.status === 'in-use' ? item.allocationDetails?.recipientName || '' : t('user_not_use')}
                    </td>
                    <td className="px-3 py-4">{renderCondition(item)}</td>
                    <td className="px-3 py-4 text-right font-mono">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-3 py-4">
                      {t(item.location) || t("in_stock")}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button onClick={() => onAllocateItem(item)} className="p-2 text-blue-600 hover:text-blue-400 disabled:text-gray-400" title={t("allocate_device")} disabled={item.status !== "available"}>
                          <LogOut className="w-5 h-5" />
                        </button>
                        <button onClick={() => onViewItem(item)} className="p-2 text-green-600 hover:text-green-400" title={t("view")}>
                          <Eye className="w-5 h-5" />
                        </button>
                        <button onClick={() => onEditItem(item)} className="p-2 text-yellow-600 hover:text-yellow-400" title={t("edit")}>
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDeleteItem(item)} className="p-2 text-red-600 hover:text-red-400" title={t("delete")}>
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    <p>{t("no_devices_match_search")}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- GIAO DIỆN CARD CHO MOBILE --- */}
      <div className="md:hidden space-y-3">
        {sortedEquipment && sortedEquipment.length > 0 ? (
          sortedEquipment.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow px-2 flex items-center gap-2"
            >
              <div className="flex-grow min-w-[150px] w-2/5 pr-2 border-r dark:border-gray-700 p-2 space-y-3">
                <p className="font-bold text-xs text-gray-900 dark:text-gray-200 truncate">
                  - {item.name}
                </p>
                <p className="col-span-2">
                  <strong>- {t("serial_number_sn_mobile")}:</strong>
                  <div className="inline ml-1 text-xs text-gray-500 dark:text-gray-400">
                    {item.serialNumber || "N/A"}
                  </div> 
                </p>
                <p>
                  <strong>- {t("category")}: </strong>
                  <div className="inline ml-1 text-xs text-gray-500 dark:text-gray-400">
                    {(categories.find((c) => c.id === item.category) || {})
                    .name || item.category}
                  </div>
                </p>
                <p className="col-span-2">
                  - <strong>{t("condition")}:</strong> 
                  <div className="inline ml-1 text-xs text-gray-500 dark:text-gray-400">
                    {renderCondition(item)}
                  </div>
                </p>
              </div>
              <div className="flex-grow pl-2 w-3/5 text-xs space-y-3 p-2">
                <p>
                  - <strong>{t("location")}:</strong>{" "}
                  <div className="inline ml-1 text-xs text-gray-500 dark:text-gray-400">
                    {t(item.location) || t("in_stock")}
                  </div>
                </p>
                {item.status === 'in-use' && (
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <User className="w-4 h-4"/>
                      <span>{item.allocationDetails?.recipientName || ''}</span>
                  </div>
                )}
                {item.status !== 'in-use' && (
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4"/>
                      <span className="text-gray-500">{t('user_not_use')}</span>
                  </div>
                )}
                <span
                  className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[item.status] || "bg-gray-100"
                  }`}
                >
                  {statusLabels[item.status] || item.status}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => onAllocateItem(item)}
                  disabled={item.status !== "available"}
                  className="p-1.5 rounded-full disabled:text-gray-500 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewItem(item)}
                  className="p-1.5 rounded-full text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditItem(item)}
                  className="p-1.5 rounded-full text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteItem(item)}
                  className="p-1.5 rounded-full text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p>{t("no_devices_match_search")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryView;

