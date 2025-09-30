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
  Download,
  Package,
} from "lucide-react";
import { useSort } from "../hooks/useSort";
import { CSVLink } from "react-csv";

const ReportsView = ({ transactions, t }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionType, setActionType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
        color: "text-purple-500",
      },
      "procurement-purchased": {
        text: t("procurement-purchased"),
        icon: CheckCircle,
        color: "text-teal-500",
      },
      "procurement-deleted": {
        text: t("procurement-deleted"),
        icon: XCircle,
        color: "text-red-500",
      },
      "procurement-cancelled": {
        text: t("procurement-cancelled"),
        icon: XCircle,
        color: "text-red-500",
      },
      "import-purchase": {
        text: t("import-purchase"),
        icon: ArrowDownLeft,
        color: "text-green-500",
      },
      "import-recall": {
        text: t("import-recall"),
        icon: RotateCcw,
        color: "text-green-500",
      },
      "import-legacy": {
        text: t("import-legacy"),
        icon: ArrowDownLeft,
        color: "text-green-500",
      },
      "export-allocate": {
        text: t("export-allocate"),
        icon: ArrowUpRight,
        color: "text-yellow-500",
      },
      "inventory-update": {
        text: t("inventory-update"),
        icon: Edit,
        color: "text-amber-500",
      },
      "inventory-delete": {
        text: t("inventory-delete"),
        icon: Trash2,
        color: "text-red-500",
      },
      "inventory-update-note": {
        text: t("inventory-update-note"),
        icon: Edit,
        color: "text-blue-500",
      },
      "inventory-repair-complete": {
        text: t("inventory-repair-complete"),
        icon: CheckCircle,
        color: "text-green-500",
      },
      "inventory-unrepairable": {
        text: t("inventory-unrepairable"),
        icon: XCircle,
        color: "text-orange-500",
      },
      "inventory-liquidated": {
        text: t("inventory-liquidated"),
        icon: Trash2,
        color: "text-slate-500",
      },
    }),
    [t]
  );

  const renderDetails = (trans) => {
    if (!trans.details) return "---";
    const details = trans.details;
    if (details.note) return `Note: ${details.note}`;
    if (details.serials) return `SNs: ${details.serials.join(", ")}`;
    if (details.recipientName)
      return `${t("recipient")}: ${details.recipientName}`;
    if (details.returnCondition)
      return `${t("condition_on_recall")}: ${t(details.returnCondition)}`;
    if (details.recalledFrom)
      return `${t("recalled_from_user")}: ${details.recalledFrom}`;
    return Object.entries(details)
      .map(([key, value]) => `${t(key) || key}: ${value}`)
      .join("; ");
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((trans) => {
      const query = searchQuery.toLowerCase();
      const searchMatch =
        !query ||
        (trans.itemName && trans.itemName.toLowerCase().includes(query)) ||
        (trans.user && trans.user.toLowerCase().includes(query));

      const typeKey = `${trans.type}-${trans.reason}`;
      const actionMatch = actionType === "all" || typeKey === actionType;

      const transDate = new Date(trans.timestamp);
      const startMatch = !startDate || new Date(startDate) <= transDate;
      const endMatch =
        !endDate || transDate <= new Date(endDate).setHours(23, 59, 59, 999);

      return searchMatch && actionMatch && startMatch && endMatch;
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
      { label: t("action"), key: "actionText" },
      { label: t("object"), key: "itemName" },
      { label: t("quantity"), key: "quantity" },
      { label: t("performed_by"), key: "user" },
      { label: t("details"), key: "detailsText" },
    ],
    [t]
  );

  const csvData = useMemo(() => {
    return sortedTransactions.map((trans) => {
      const detailKey = `${trans.type}-${trans.reason}`;
      return {
        ...trans,
        timestamp: new Date(trans.timestamp).toLocaleString(t("locale_string")),
        actionText: logDetails[detailKey]?.text || detailKey,
        detailsText: renderDetails(trans),
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedTransactions, logDetails, t]);

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">{/* Page transition */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">{/* Header animation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {t("activity_log_history")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("activity_log_desc")}
            </p>
          </div>
          <CSVLink
            data={csvData}
            headers={headers}
            filename={"inventory_report.csv"}
            className="p-2.5 bg-green-100 dark:bg-green-700/50 rounded-lg text-green-600 dark:text-green-300 animate-hoverScale transition-all duration-200"
          >
            <Download className="w-5 h-5" />
          </CSVLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold mb-2">
              {t("search")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_inventory_placeholder")}
                className="w-full pl-9 pr-4 py-2 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">
              {t("action_type")}
            </label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
            >
              <option value="all">{t("all")}</option>
              {Object.entries(logDetails).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.text}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">
              {t("from_date")}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">
              {t("to_date")}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp">{/* Table container animation */}
        <div className="flex-grow overflow-y-auto hide-scrollbar">
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
