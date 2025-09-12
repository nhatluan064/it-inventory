// src/views/RecallView.js
import React from "react";
import { RotateCcw } from "lucide-react";

const RecallView = ({ allocatedItems, onRecallItem, t }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {t("recall_dedicated_title")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("recall_dedicated_desc")}
        </p>
      </div>

      {/* --- Giao diện Bảng cho Desktop --- */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">
                {t("device_user_column")}
              </th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 dark:text-gray-300 uppercase">
                {t("quantity")}
              </th>
              <th className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-300 uppercase">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {allocatedItems.length > 0 ? (
              allocatedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-gray-200">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onRecallItem(item)}
                      className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-md"
                      title={t("recall_device")}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-12 text-gray-500 dark:text-gray-400"
                >
                  {t("no_allocated_items_for_recall")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Giao diện Card cho Mobile --- */}
      <div className="md:hidden p-4 space-y-4">
        {allocatedItems.length > 0 ? (
          allocatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("quantity")}: {item.quantity}
                </p>
              </div>
              <button
                onClick={() => onRecallItem(item)}
                className="p-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 rounded-full"
                title={t("recall_device")}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t("no_allocated_items_for_recall")}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecallView;
