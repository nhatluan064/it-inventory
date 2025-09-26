import React from "react";
import { CheckCircle, XCircle, Edit, Package } from "lucide-react";
import { useSort } from "../hooks/useSort";

const MaintenanceView = ({
  items,
  onRepairComplete,
  onMarkUnrepairable,
  onEditNote,
  t,
}) => {
  const {
    items: sortedItems,
    requestSort,
    sortConfig,
  } = useSort(items, { key: "maintenanceDate", direction: "descending" });

  const columns = [
    { key: "name", label: "device_name", sortable: true },
    { key: "serialNumber", label: "serial_number_sn", sortable: true },
    { key: "maintenanceDate", label: "maintenance_date", sortable: true },
    { key: "condition", label: "failure_note", sortable: true },
    { key: "recalledFrom", label: "recalled_from_user", sortable: true },
    {
      key: "actions",
      label: "actions",
      sortable: false,
      className: "text-center",
    },
  ];

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString(t("locale_string"));

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">{/* Page transition */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">{/* Header animation */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          {t("maintenance_management")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("maintenance_desc")}
        </p>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp">{/* Table container animation */}
        <div className="flex-grow overflow-y-auto hide-scrollbar">
          {sortedItems.length > 0 ? (
            <table className="w-full text-xs table-fixed">
              <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3.5 text-left font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 border-gray-100 dark:border-gray-700 ${
                        col.className || ""
                      } cursor-pointer select-none`}
                      onClick={() => col.sortable && requestSort(col.key)}
                    >
                      {t(col.label)}
                      {sortConfig.key === col.key &&
                        (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {sortedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="h-16 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 font-semibold align-middle">
                      {item.name}
                    </td>
                    <td className="px-4 font-mono align-middle">
                      {item.serialNumber || "N/A"}
                    </td>
                    <td className="px-4 align-middle">
                      {formatDate(item.maintenanceDate)}
                    </td>
                    <td className="px-4 align-middle">{item.condition}</td>
                    <td className="px-4 font-semibold align-middle">
                      {item.recalledFrom || "---"}
                    </td>
                    <td className="px-4 text-center align-middle">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onEditNote(item)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 animate-hoverScale transition-all duration-200"
                          title={t("edit_failure_note")}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRepairComplete(item)}
                          className="p-2 rounded-lg text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 animate-hoverScale transition-all duration-200"
                          title={t("repair_completed")}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onMarkUnrepairable(item)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 animate-hoverScale transition-all duration-200"
                          title={t("mark_unrepairable")}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 m-auto">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-sm font-semibold">{t("no_data_available")}</p>
              <p className="mt-2 text-xs text-gray-500">
                {t("maintenance_desc")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceView;
