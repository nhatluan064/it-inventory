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
  statusColors,
  statusLabels,
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
    // --- THAY ĐỔI 4: THÊM CỘT MỚI ---
    { key: "recalledFrom", label: "recalled_from_user", sortable: true },
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
    <div className="space-y-6">
      {/* Card Tiêu đề */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg font-bold">{t("maintenance_management")}</h2>
        <p className="text-xs text-gray-500 mt-1">{t("maintenance_desc")}</p>
      </div>

      {/* Card Danh sách */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
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
                    <td className="px-3 py-4 font-medium">{item.name}</td>
                    <td className="px-3 py-4 font-mono">
                      {item.serialNumber || "N/A"}
                    </td>
                    <td className="px-3 py-4">
                      {formatDate(item.maintenanceDate)}
                    </td>
                    <td className="px-3 py-4">{item.condition}</td>
                    {/* --- THAY ĐỔI 5: HIỂN THỊ DỮ LIỆU CỘT MỚI --- */}
                    <td className="px-3 py-4 font-semibold">
                      {item.recalledFrom || "---"}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
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
        <div className="md:hidden space-y-3 p-4">
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SN: {item.serialNumber || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => onEditNote(item)} className="p-2" title={t("edit_failure_note")}><Edit className="w-4 h-4 text-blue-600" /></button>
                    <button onClick={() => onRepairComplete(item)} className="p-2" title={t("repair_completed")}><CheckCircle className="w-4 h-4 text-green-600" /></button>
                    <button onClick={() => onMarkUnrepairable(item)} className="p-2" title={t("mark_unrepairable")}><XCircle className="w-4 h-4 text-red-600" /></button>
                  </div>
                </div>
                <div className="text-xs pt-2 border-t dark:border-gray-600 space-y-1">
                  <p><strong>{t("maintenance_date")}:</strong> {formatDate(item.maintenanceDate)}</p>
                  {/* --- THAY ĐỔI 6: HIỂN THỊ TRÊN GIAO DIỆN MOBILE --- */}
                  <p className="font-semibold text-blue-600 dark:text-blue-400"><strong>{t("recalled_from_user")}:</strong> {item.recalledFrom || "---"}</p>
                  <p><strong>{t("failure_note")}:</strong> {item.condition}</p>
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
    </div>
  );
};

export default MaintenanceView;