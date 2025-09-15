// src/views/LiquidationView.js
import React from "react";
import { Trash2 } from "lucide-react";
import { useSort, SortableHeader } from "../hooks/useSort";

const LiquidationView = ({ items, onLiquidateItem, t }) => {
  const { items: sortedItems, requestSort, sortConfig } = useSort(items);
  
  const columns = [
    { key: "name", label: "device_name", sortable: true },
    { key: "serialNumber", label: "serial_number_sn", sortable: true },
    { key: "condition", label: "failure_note", sortable: true },
    {
      key: "actions",
      label: "actions",
      sortable: false,
      className: "text-center",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Card Tiêu đề */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t("liquidation_list")}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("liquidation_desc")}</p>
      </div>

      {/* Container chung cho cả desktop và mobile */}
      
        {/* BẢNG DÀNH CHO DESKTOP (display: hidden on mobile) */}
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
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 font-mono">
                      {item.serialNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4">{item.condition}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onLiquidateItem(item)}
                        className="p-2"
                        title={t("confirm_liquidated")}
                      >
                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    {t("no_liquidation_items")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* GIAO DIỆN CARD CHO MOBILE (display: block on mobile) */}
        <div className="md:hidden space-y-3 ">
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
                  <button 
                    onClick={() => onLiquidateItem(item)} 
                    className="p-2 -mt-2 -mr-2" 
                    title={t("confirm_liquidated")}
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
                <div className="text-xs pt-2 border-t dark:border-gray-600">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>{t("failure_note")}:</strong> {item.condition}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {t("no_liquidation_items")}
            </div>
          )}
        </div>
      
    </div>
  );
};

export default LiquidationView;