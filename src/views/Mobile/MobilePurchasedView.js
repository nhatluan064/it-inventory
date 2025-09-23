import React, { useState, useMemo } from "react";
import {
  LogIn,
  Layers,
  Filter,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const MobilePurchasedView = ({
  items,
  onImportItem,
  categories,
  t,
  fullInventory,
}) => {
  const [serialNumbers, setSerialNumbers] = useState({});
  const [importingIds, setImportingIds] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    sortKey: "name",
    sortDirection: "asc",
  });
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleSnChange = (id, value) => {
    setSerialNumbers((prev) => ({ ...prev, [id]: value }));
  };

  const handleImportClick = async (item) => {
    const sns = (serialNumbers[item.id] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (sns.length !== item.purchaseQuantity) {
      toast.error(
        t("toast_sn_quantity_mismatch", {
          snCount: sns.length,
          purchaseCount: item.purchaseQuantity,
        })
      );
      return;
    }

    const uniqueSns = new Set(sns.map((s) => s.toLowerCase()));
    if (uniqueSns.size !== sns.length) {
      toast.error(t("toast_duplicate_sn_error"));
      return;
    }

    setImportingIds((prev) => [...prev, item.id]);
    try {
      await onImportItem(item, sns);
      // On success, the item will be removed from the list, so no need to update importingIds
    } catch (error) {
      // If there's an error, remove from importing state
      setImportingIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSortChange = (sortKey) => {
    setFilters((prev) => {
      const newDirection =
        prev.sortKey === sortKey && prev.sortDirection === "asc"
          ? "desc"
          : "asc";
      return { ...prev, sortKey, sortDirection: newDirection };
    });
    setIsSortOpen(false);
  };

  const filteredAndSortedItems = useMemo(() => {
    let sortedItems = [...items].filter((item) =>
      item.name.toLowerCase().includes(filters.search.toLowerCase())
    );

    sortedItems.sort((a, b) => {
      const aVal = a[filters.sortKey] || "";
      const bVal = b[filters.sortKey] || "";
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      });
      const comparison = collator.compare(aVal.toString(), bVal.toString());
      return filters.sortDirection === "asc" ? comparison : -comparison;
    });
    return sortedItems;
  }, [items, filters]);

  const sortOptions = [
    { key: "name", label: t("device_name") },
    { key: "category", label: t("category") },
    { key: "purchaseQuantity", label: t("quantity") },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{t("purchased_list")}</h2>
            <p className="text-sm text-gray-500">{t("purchased_desc")}</p>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
        {isFilterOpen && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("search_master_item_placeholder")}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 col-span-1"
              />
              <div className="relative col-span-1">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  <span className="text-sm">{t("sort_by")}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isSortOpen && (
                  <div className="absolute z-10 top-full right-0 mt-2 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => handleSortChange(opt.key)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-between items-center"
                      >
                        {opt.label}
                        {filters.sortKey === opt.key && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {filteredAndSortedItems.map((item) => {
          const isImporting = importingIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-4 space-y-3 transition-opacity duration-300 ${
                isImporting ? "opacity-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-base">{item.name}</p>
                  <div className="flex items-center mt-1 gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-500" />
                    <span className="capitalize text-gray-700 dark:text-gray-300 text-xs">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-500">
                    {t("quantity")}
                  </p>
                  <p className="font-semibold text-lg">
                    {item.purchaseQuantity}
                  </p>
                </div>
              </div>
              <div className="border-t dark:border-gray-600 pt-3 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("serial_number_sn")}
                  </label>
                  <textarea
                    value={serialNumbers[item.id] || ""}
                    onChange={(e) => handleSnChange(item.id, e.target.value)}
                    placeholder={t("add_multiple_sn_placeholder")}
                    className="w-full text-xs p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    rows="2"
                  />
                </div>
                <button
                  onClick={() => handleImportClick(item)}
                  disabled={isImporting}
                  className="w-full bg-blue-500 text-white p-2 rounded-md flex items-center justify-center gap-2 disabled:bg-blue-300"
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {isImporting ? t("importing") : t("import_to_inventory")}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">{t("no_data_available")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePurchasedView;
