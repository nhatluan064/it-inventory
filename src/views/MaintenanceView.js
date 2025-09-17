// src/views/MaintenanceView.js
import React from "react";
import {
  CheckCircle,
  XCircle,
  Edit,
  Hash,
  Calendar,
  Package,
} from "lucide-react";
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
    {
      key: "name",
      label: "device_name",
      sortable: true,
      className: "min-w-[150px]",
    },
    {
      key: "serialNumber",
      label: "serial_number_sn",
      sortable: true,
      className: "min-w-[130px]",
    },
    {
      key: "maintenanceDate",
      label: "maintenance_date",
      sortable: true,
      className: "min-w-[120px]",
    },
    {
      key: "condition",
      label: "failure_note",
      sortable: true,
      className: "min-w-[200px]",
    },
    {
      key: "recalledFrom",
      label: "recalled_from_user",
      sortable: true,
      className: "min-w-[150px]",
    },
    {
      key: "actions",
      label: "actions",
      sortable: false,
      className: "text-center min-w-[120px]",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(t("locale_string"));
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER CARD --- */}
      <div className="glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          {t("maintenance_management")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("maintenance_desc")}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-orange-500 to-red-500 mt-2 rounded-full" />
      </div>

      {/* --- CONTENT --- */}
      {sortedItems.length > 0 ? (
        <>
          {/* --- DESKTOP TABLE --- */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hidden md:block border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                  <SortableHeader
                    columns={columns}
                    requestSort={requestSort}
                    sortConfig={sortConfig}
                    t={t}
                  />
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {sortedItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        index % 2 === 0
                          ? "bg-gray-50/30 dark:bg-gray-900/20"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 font-semibold">{item.name}</td>
                      <td className="px-4 py-3.5 font-mono">
                        {item.serialNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3.5">
                        {formatDate(item.maintenanceDate)}
                      </td>
                      <td className="px-4 py-3.5">{item.condition}</td>
                      <td className="px-4 py-3.5 font-semibold">
                        {item.recalledFrom || "---"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onEditNote(item)}
                            className="p-2 rounded-lg text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            title={t("edit_failure_note")}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRepairComplete(item)}
                            className="p-2 rounded-lg text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30"
                            title={t("repair_completed")}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onMarkUnrepairable(item)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
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
            </div>
          </div>

          {/* --- MOBILE CARDS --- */}
          <div className="md:hidden space-y-4">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Hash className="w-3 h-3" />
                      {item.serialNumber || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 -mr-2 -mt-2">
                    <button
                      onClick={() => onEditNote(item)}
                      className="p-2 rounded-xl text-blue-500 hover:bg-blue-100"
                      title={t("edit_failure_note")}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRepairComplete(item)}
                      className="p-2 rounded-xl text-green-500 hover:bg-green-100"
                      title={t("repair_completed")}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMarkUnrepairable(item)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-100"
                      title={t("mark_unrepairable")}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs pt-3 border-t dark:border-gray-700 space-y-1.5">
                  <p>
                    <strong>{t("maintenance_date")}:</strong>{" "}
                    {formatDate(item.maintenanceDate)}
                  </p>
                  <p className="font-semibold text-blue-600 dark:text-blue-400">
                    <strong>{t("recalled_from_user")}:</strong>{" "}
                    {item.recalledFrom || "---"}
                  </p>
                  <p>
                    <strong>{t("failure_note")}:</strong> {item.condition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("no_data_available")}</p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceView;
