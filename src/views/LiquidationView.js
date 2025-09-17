// src/views/LiquidationView.js
import React from "react";
import { Trash2, Package, XCircle, Hash } from "lucide-react";
import { useSort, SortableHeader } from "../hooks/useSort";

const LiquidationView = ({ items, onLiquidateItem, t }) => {
  const { items: sortedItems, requestSort, sortConfig } = useSort(items);

  const columns = [
    {
      key: "name",
      label: "device_name",
      sortable: true,
      className: "min-w-[200px]",
    },
    {
      key: "serialNumber",
      label: "serial_number_sn",
      sortable: true,
      className: "min-w-[150px]",
    },
    { key: "condition", label: "failure_note", sortable: true },
    {
      key: "actions",
      label: "actions",
      sortable: false,
      className: "text-center min-w-[100px]",
    },
  ];

  return (
    <div className="space-y-6 animate-scaleIn">
      {/* --- HEADER CARD --- */}
      <div className="glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-500 via-gray-500 to-gray-600 bg-clip-text text-transparent">
          {t("liquidation_list")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("liquidation_desc")}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-slate-500 to-gray-600 mt-2 rounded-full" />
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
                      <td className="px-4 py-3.5">{item.condition}</td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => onLiquidateItem(item)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                          title={t("confirm_liquidated")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                  <button
                    onClick={() => onLiquidateItem(item)}
                    className="p-2 -mt-2 -mr-2 text-red-500 hover:bg-red-100 rounded-xl"
                    title={t("confirm_liquidated")}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xs pt-3 border-t dark:border-gray-600">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>{t("failure_note")}:</strong> {item.condition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* EMPTY STATE */
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <Trash2 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("liquidation_empty_title")}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t("liquidation_empty_text")}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiquidationView;
