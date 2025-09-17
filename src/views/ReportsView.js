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
      "procurement-request": {
        text: t("procurement-request"),
        icon: FilePlus,
        color: "text-blue-500",
      },
      "procurement-purchasing": {
        text: t("procurement-purchasing"),
        icon: ShoppingCart,
        color: "text-yellow-500",
      },
      "procurement-purchased": {
        text: t("procurement-purchased"),
        icon: CheckCircle,
        color: "text-green-500",
      },
      "procurement-deleted": {
        text: t("procurement-deleted"),
        icon: Trash2,
        color: "text-red-500",
      },
      "procurement-reverted": {
        text: t("procurement-reverted"),
        icon: RotateCcw,
        color: "text-orange-500",
      },
      "procurement-cancelled": {
        text: t("procurement-cancelled"),
        icon: XCircle,
        color: "text-red-500",
      },
      "import-purchase": {
        text: t("import-purchase"),
        icon: ArrowUpRight,
        color: "text-green-600",
      },
      "import-recall": {
        text: t("import-recall"),
        icon: ArrowUpRight,
        color: "text-green-600",
      },
      "import-legacy": {
        text: t("import-legacy"),
        icon: ArrowUpRight,
        color: "text-teal-600",
      },
      "export-allocate": {
        text: t("export-allocate"),
        icon: ArrowDownLeft,
        color: "text-red-600",
      },
      "inventory-update": {
        text: t("inventory-update"),
        icon: Edit,
        color: "text-gray-500",
      },
      "inventory-delete": {
        text: t("inventory-delete"),
        icon: Trash2,
        color: "text-red-500",
      },
      "inventory-update-note": {
        text: t("inventory-update-note"),
        icon: Edit,
        color: "text-indigo-500",
      },
      "inventory-repair-complete": {
        text: t("inventory-repair-complete"),
        icon: CheckCircle,
        color: "text-green-500",
      },
      "inventory-unrepairable": {
        text: t("inventory-unrepairable"),
        icon: XCircle,
        color: "text-red-500",
      },
      "inventory-liquidated": {
        text: t("inventory-liquidated"),
        icon: Trash2,
        color: "text-red-700",
      },
    }),
    [t]
  );

  const renderDetails = (trans) => {
    if (trans.reason === "allocate" && trans.details)
      return `${t("recipient")}: ${trans.details.recipientName}`;
    if (trans.details?.note) return `${t("note")}: ${trans.details.note}`;
    if (trans.details?.returnCondition)
      return `${t("condition")}: ${t(trans.details.returnCondition)}`;
    return ``;
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((trans) => {
      const logKey = `${trans.type}-${trans.reason}`;
      const itemName = trans.itemName?.toLowerCase() || "";
      const detailsText = JSON.stringify(trans.details || {}).toLowerCase();
      if (
        searchQuery &&
        !itemName.includes(searchQuery.toLowerCase()) &&
        !detailsText.includes(searchQuery.toLowerCase())
      )
        return false;
      if (actionType !== "all" && logKey !== actionType) return false;
      const transactionDate = new Date(trans.timestamp);
      if (startDate && transactionDate < new Date(startDate)) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (transactionDate > endOfDay) return false;
      }
      return true;
    });
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
      { label: t("timestamp"), key: "timestamp" },
      { label: t("action"), key: "action" },
      { label: t("object"), key: "object" },
      { label: t("quantity"), key: "quantity" },
      { label: t("performed_by"), key: "performedBy" },
      { label: t("details"), key: "details" },
    ],
    [t]
  );

  const csvData = useMemo(() => {
    return sortedTransactions.map((trans) => {
      const detail = logDetails[`${trans.type}-${trans.reason}`] || {};
      return {
        timestamp: new Date(trans.timestamp).toLocaleString(t("locale_string")),
        action: detail.text || `${trans.type}-${trans.reason}`,
        object: trans.itemName,
        quantity: trans.quantity || "",
        performedBy: trans.user,
        details: renderDetails(trans),
      };
    });
  }, [sortedTransactions, logDetails, t]);

  return (
    <div className="space-y-6 animate-scaleIn">
      {/* Card Tiêu đề & Lọc */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">{t("activity_log_history")}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {t("activity_log_desc")}
            </p>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
            >
              {isMobileFilterOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <SlidersHorizontal className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end ${
            isMobileFilterOpen ? "grid" : "hidden md:grid"
          }`}
        >
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium mb-1">
              {t("search")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("search")}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              {t("action_type")}
            </label>
            <select
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            >
              <option value="all">{t("all")}</option>
              {Object.entries(logDetails).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.text}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">
                {t("from_date")}
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                {t("to_date")}
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 opacity-0 hidden md:block">
              .
            </label>
            <CSVLink
              data={csvData}
              headers={headers}
              filename={`IT_Inventory_Log_${new Date()
                .toISOString()
                .slice(0, 10)}.csv`}
              className="w-full text-center block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <span className="hidden md:inline">{t("Xuất file Log")}</span>
              <Download className="w-4 h-4 md:hidden mx-auto" />
            </CSVLink>
          </div>
        </div>
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
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((trans) => {
                  const detail = logDetails[
                    `${trans.type}-${trans.reason}`
                  ] || {
                    text: `${trans.type} - ${trans.reason}`,
                    icon: Edit,
                    color: "text-gray-500",
                  };
                  const Icon = detail.icon;
                  return (
                    <tr
                      key={trans.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-3 py-4 whitespace-nowrap">
                        {new Date(trans.timestamp).toLocaleString(
                          t("locale_string")
                        )}
                      </td>
                      <td className="px-3 py-4">
                        <div
                          className={`inline-flex items-center gap-2 font-semibold ${detail.color}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{detail.text}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 font-medium">
                        {trans.itemName}
                      </td>
                      <td className="px-3 py-4 text-right font-bold">
                        {trans.quantity || "-"}
                      </td>
                      <td className="px-3 py-4">{trans.user}</td>
                      <td className="px-3 py-4">{renderDetails(trans)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-12 text-sm"
                  >
                    {t("no_data_available")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden p-4 space-y-4">
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((trans) => {
              const detail = logDetails[`${trans.type}-${trans.reason}`] || {
                text: `${trans.type} - ${trans.reason}`,
                icon: Edit,
                color: "text-gray-500",
              };
              const Icon = detail.icon;
              return (
                <div
                  key={trans.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2 shadow"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div
                      className={`flex items-center gap-2 font-semibold ${detail.color} text-sm`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{detail.text}</span>
                    </div>
                    <span className="text-right text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(trans.timestamp).toLocaleString(
                        t("locale_string")
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 border-t dark:border-gray-600 pt-2">
                    <p>
                      <strong>{t("object")}:</strong> {trans.itemName}{" "}
                      {trans.quantity ? `(SL: ${trans.quantity})` : ""}
                    </p>
                    <p>
                      <strong>{t("performed_by")}:</strong> {trans.user}
                    </p>
                    {renderDetails(trans) && (
                      <p>
                        <strong>{t("details")}:</strong> {renderDetails(trans)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
              {t("no_data_available")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
