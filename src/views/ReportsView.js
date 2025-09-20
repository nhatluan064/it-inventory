// src/views/ReportsView.js
import React, { useState, useMemo } from "react";
import {
  FilePlus,
  ShoppingCart,
  CheckCircle,
  Trash2,
  RotateCcw,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Edit,
  Search,
  SlidersHorizontal,
  X,
  Download,
  Package,
} from "lucide-react";
import { useSort, SortableHeader } from "../hooks/useSort";
import { CSVLink } from "react-csv";

const ReportsView = ({ transactions, t }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionType, setActionType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const logDetails = useMemo(
    () => ({
      /* ... giữ nguyên ... */
    }),
    [t]
  );
  const renderDetails = (trans) => {
    /* ... giữ nguyên ... */
  };
  const filteredTransactions = useMemo(() => {
    /* ... giữ nguyên ... */
  }, [transactions, searchQuery, actionType, startDate, endDate]);
  const {
    items: sortedTransactions,
    requestSort,
    sortConfig,
  } = useSort(filteredTransactions, {
    key: "timestamp",
    direction: "descending",
  });
  const columns = [
    { key: "timestamp", label: "timestamp", sortable: true },
    { key: "reason", label: "action", sortable: true },
    { key: "itemName", label: "object", sortable: true },
    {
      key: "quantity",
      label: "quantity",
      sortable: true,
      className: "text-right",
    },
    { key: "user", label: "performed_by", sortable: true },
    { key: "details", label: "details", sortable: false },
  ];
  const headers = useMemo(
    () => [
      /* ... giữ nguyên ... */
    ],
    [t]
  );
  const csvData = useMemo(() => {
    /* ... giữ nguyên ... */
  }, [sortedTransactions, logDetails, t]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {t("activity_log_history")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("activity_log_desc")}
            </p>
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end ${
            isMobileFilterOpen ? "grid" : "hidden md:grid"
          }`}
        >
          {/* ... JSX cho các bộ lọc giữ nguyên ... */}
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          <table className="w-full text-xs table-fixed">
            <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3.5 text-left font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 border-gray-100 dark:border-gray-700 ${
                      col.className || ""
                    }`}
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
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((trans) => {
                  const detail = logDetails[
                    `${trans.type}-${trans.reason}`
                  ] || {
                    text: `${trans.type}-${trans.reason}`,
                    icon: Edit,
                    color: "text-gray-500",
                  };
                  const Icon = detail.icon;
                  return (
                    <tr
                      key={trans.id}
                      className="h-16 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-4 align-middle whitespace-nowrap">
                        {new Date(trans.timestamp).toLocaleString(
                          t("locale_string")
                        )}
                      </td>
                      <td className="px-4 align-middle">
                        <div
                          className={`inline-flex items-center gap-2 font-semibold ${detail.color}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{detail.text}</span>
                        </div>
                      </td>
                      <td className="px-4 font-medium align-middle">
                        {trans.itemName}
                      </td>
                      <td className="px-4 text-right font-bold align-middle">
                        {trans.quantity || "-"}
                      </td>
                      <td className="px-4 align-middle">{trans.user}</td>
                      <td className="px-4 align-middle">
                        {renderDetails(trans)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <Package className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="mt-3 text-sm text-gray-500">
                      {t("no_data_available")}
                    </p>
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

export default ReportsView;
