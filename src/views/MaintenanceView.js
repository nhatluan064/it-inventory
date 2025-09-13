// src/views/MaintenanceView.js
import React from "react";
import { CheckCircle, XCircle, Edit } from "lucide-react";
import { useSort, SortableHeader } from "../hooks/useSort";

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
    {
      key: "actions",
      label: "actions",
      sortable: false,
      className: "text-center",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(t("locale_string"));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        {/* ĐÃ SỬA: text-xl -> text-lg */}
        <h2 className="text-lg font-bold">{t("maintenance_management")}</h2>
        {/* ĐÃ SỬA: text-sm -> text-xs */}
        <p className="text-xs text-gray-500 mt-1">{t("maintenance_desc")}</p>
      </div>

      {/* --- Giao diện Bảng cho Desktop --- */}
      <div className="overflow-x-auto hidden md:block">
        {/* ĐÃ SỬA: text-sm -> text-xs */}
        <table className="w-full text-xs">
          <SortableHeader
            columns={columns}
            requestSort={requestSort}
            sortConfig={sortConfig}
            t={t}
          />
          <tbody className="divide-y dark:divide-gray-700">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 font-mono">
                    {item.serialNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(item.maintenanceDate)}
                  </td>
                  <td className="px-6 py-4">{item.condition}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
                      <button
                        onClick={() => onEditNote(item)}
                        className="p-2"
                        title={t("edit_failure_note")}
                      >
                        <Edit className="w-4 h-4 text-blue-600 hover:text-blue-400" />
                      </button>
                      <button
                        onClick={() => onRepairComplete(item)}
                        className="p-2"
                        title={t("repair_completed")}
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 hover:text-green-400" />
                      </button>
                      <button
                        onClick={() => onMarkUnrepairable(item)}
                        className="p-2"
                        title={t("mark_unrepairable")}
                      >
                        <XCircle className="w-4 h-4 text-red-600 hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  {t("no_data_available")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Giao diện Card cho Mobile --- */}
      <div className="md:hidden p-4 space-y-4">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2 shadow"
            >
              <div>
                {/* ĐÃ SỬA: Thêm text-sm */}
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  {item.name}
                </p>
                {/* ĐÃ SỬA: Thêm text-xs */}
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {item.serialNumber || "N/A"}
                </p>
              </div>
              {/* ĐÃ SỬA: text-sm -> text-xs */}
              <div className="text-xs text-gray-700 dark:text-gray-300 border-t dark:border-gray-600 pt-2">
                <p>
                  <strong>{t("maintenance_date")}:</strong>{" "}
                  {formatDate(item.maintenanceDate)}
                </p>
                <p>
                  <strong>{t("failure_note")}:</strong> {item.condition}
                </p>
              </div>
              <div className="flex items-center justify-end space-x-2 border-t dark:border-gray-600 pt-2 mt-2">
                {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
                <button
                  onClick={() => onEditNote(item)}
                  className="p-2"
                  title={t("edit_failure_note")}
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => onRepairComplete(item)}
                  className="p-2"
                  title={t("repair_completed")}
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={() => onMarkUnrepairable(item)}
                  className="p-2"
                  title={t("mark_unrepairable")}
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t("no_data_available")}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceView;