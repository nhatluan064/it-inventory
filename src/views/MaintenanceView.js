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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
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
        <div className="md:hidden space-y-3 p-2">
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-stretch gap-3 h-32"
              >
                <div className="flex-grow w-2/5 pr-2 border-r dark:border-gray-700 flex flex-col">
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {item.serialNumber || "N/A"}
                    </p>
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors.maintenance}`}
                    >
                      {statusLabels.maintenance}
                    </span>
                  </div>
                </div>
                <div className="flex-grow w-3/5 text-xs flex flex-col justify-center gap-y-1">
                  <p>
                    <strong>{t("maintenance_date")}:</strong>{" "}
                    {formatDate(item.maintenanceDate)}
                  </p>
                  <p>
                    <strong>{t("failure_note")}:</strong> {item.condition}
                  </p>
                </div>
                <div className="flex flex-col space-y-1 justify-center">
                  <button
                    onClick={() => onEditNote(item)}
                    className="p-1.5 rounded-full text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRepairComplete(item)}
                    className="p-1.5 rounded-full text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onMarkUnrepairable(item)}
                    className="p-1.5 rounded-full text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <XCircle className="w-4 h-4" />
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
    </div>
  );
};

export default MaintenanceView;
