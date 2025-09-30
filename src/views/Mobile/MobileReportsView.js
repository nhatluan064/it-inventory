import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  FilePlus,
  ShoppingCart,
  CheckCircle,
  Trash2,
  RotateCcw,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Edit,
  User,
  Package,
  Info,
} from "lucide-react";
import { CSVLink } from "react-csv";

const MobileReportsView = ({ transactions, t, categories }) => {
  // State quản lý bộ lọc và sắp xếp riêng cho mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    actionType: "all",
    startDate: "",
    endDate: "",
  });

  // Tái sử dụng logic ánh xạ chi tiết log
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

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const renderDetails = useCallback((trans) => {
    // ... Tái sử dụng hàm renderDetails từ bản Desktop ...
    if (!trans.details) return null;
    const details = trans.details;
    if (details.note) return `Note: ${details.note}`;
    if (details.serials) return `SNs: ${details.serials.join(", ")}`;
    if (details.recipientName)
      return `${t("recipient")}: ${details.recipientName}`;
    if (details.returnCondition)
      return `${t("condition_on_recall")}: ${t(details.returnCondition)}`;
    if (details.recalledFrom)
      return `${t("recalled_from_user")}: ${details.recalledFrom}`;
    
    // Handle allocation details with proper labels
    const allocationLabels = {
      to: t("recipient"),
      department: t("department"),
      position: t("position"),
      from: t("from_user"),
    };
    
    return Object.entries(details)
      .map(([key, value]) => {
        const label = allocationLabels[key] || t(key) || key;
        // Resolve category ID to name
        let displayValue = value;
        if (key === "category" && categories) {
          const category = categories.find(cat => cat.id === value);
          displayValue = category ? category.name : value;
        }
        return `${label}: ${displayValue}`;
      })
      .join("; ");
  }, [t, categories]);

  const filteredTransactions = useMemo(() => {
    // Tái sử dụng logic lọc từ bản Desktop
    return transactions
      .filter((trans) => {
        const query = filters.searchQuery.toLowerCase();
        const searchMatch =
          !query ||
          (trans.itemName && trans.itemName.toLowerCase().includes(query)) ||
          (trans.user && trans.user.toLowerCase().includes(query));

        const typeKey = `${trans.type}-${trans.reason}`;
        const actionMatch =
          filters.actionType === "all" || typeKey === filters.actionType;

        const transDate = new Date(trans.timestamp);
        const startMatch =
          !filters.startDate || new Date(filters.startDate) <= transDate;
        const endMatch =
          !filters.endDate ||
          transDate <= new Date(filters.endDate).setHours(23, 59, 59, 999);

        return searchMatch && actionMatch && startMatch && endMatch;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Luôn sắp xếp mới nhất lên đầu
  }, [transactions, filters]);

  // Logic chuẩn bị dữ liệu cho file CSV export
  const csvData = useMemo(() => {
    return filteredTransactions.map((trans) => {
      const detailKey = `${trans.type}-${trans.reason}`;
      return {
        timestamp: new Date(trans.timestamp).toLocaleString(t("locale_string")),
        actionText: logDetails[detailKey]?.text || detailKey,
        itemName: trans.itemName || "N/A",
        quantity: trans.quantity || "-",
        user: trans.user,
        detailsText: renderDetails(trans) || "---",
      };
    });
  }, [filteredTransactions, logDetails, t, renderDetails]);

  const csvHeaders = useMemo(
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

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 mobile-page-enter">
      {/* Header và Bộ lọc */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("activity_log_history")}</h2>
            <p className="text-sm text-gray-500">{t("activity_log_desc")}</p>
          </div>
          <div className="flex items-center gap-2">
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename={"inventory_report.csv"}
            >
              <button className="mobile-btn-icon mobile-optimized text-green-500">
                <Download className="w-5 h-5" />
              </button>
            </CSVLink>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="mobile-btn-icon mobile-optimized"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 mobile-filter-enter">
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              placeholder={t("search")}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <select
              name="actionType"
              value={filters.actionType}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">{t("all")}</option>
              {Object.entries(logDetails).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.text}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Danh sách Card Log */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((trans) => {
            const detailKey = `${trans.type}-${trans.reason}`;
            const detail = logDetails[detailKey] || {
              text: detailKey,
              icon: Edit,
              color: "text-gray-500",
            };
            const Icon = detail.icon;
            const detailsText = renderDetails(trans);

            return (
              <div
                key={trans.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`flex items-center gap-2 font-bold ${detail.color}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{detail.text}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(trans.timestamp).toLocaleString(
                      t("locale_string")
                    )}
                  </span>
                </div>
                <div className="border-t dark:border-gray-600 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {t("object")}:
                    </span>
                    <span className="font-medium text-right">
                      {trans.itemName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t("performed_by")}:
                    </span>
                    <span className="font-medium">{trans.user}</span>
                  </div>
                  {detailsText && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        {t("details")}:
                      </span>
                      <span className="font-medium text-right">
                        {detailsText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">{t("no_data_available")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileReportsView;
