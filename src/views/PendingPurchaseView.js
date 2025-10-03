import React, { useState, useMemo, useEffect } from "react";
import { ShoppingCart, Trash2, Plus, Search, Package, ChevronDown, ChevronRight, ShoppingBag } from "lucide-react";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";
import { useSort } from "../hooks/useSort";

const PendingPurchaseView = ({
  items,
  onStartPurchase,
  onDeleteItem,
  onOpenAddFromMasterModal,
  categories,
  t,
}) => {
  const [purchaseData, setPurchaseData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});
  const [, setAnimatingRows] = useState({});
  const [subSortConfigs] = useState({});

  const { items: sortedItems } = useSort(items || [], {
    key: "name",
    direction: "ascending",
  });

  const categoryOptions = useMemo(() => {
    const allOption = { id: "all", name: t("all") };
    return [allOption, ...(categories || [])];
  }, [categories, t]);

  const groupedByCategory = useMemo(() => {
    let itemsToGroup = sortedItems;
    if (selectedCategory !== "all") {
      itemsToGroup = itemsToGroup.filter(
        (item) => item.category === selectedCategory
      );
    }
    if (searchQuery) {
      itemsToGroup = itemsToGroup.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return itemsToGroup.reduce((acc, item) => {
      const key = item.category || "uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [sortedItems, selectedCategory, searchQuery]);

  const handleDataChange = (id, field, value) => {
    setPurchaseData((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const handlePurchaseClick = (item) => {
    const price = parseFloat(purchaseData[item.id]?.price);
    const quantity = parseInt(purchaseData[item.id]?.quantity, 10) || 1;
    if (!price || price <= 0) {
      toast.error(t("toast_price_is_required"));
      return;
    }
    onStartPurchase([{ id: item.id, quantity, price }]);
  };

  const toggleExpand = (name) => {
    const isExpanded = expandedRows[name];
    if (isExpanded) {
      setAnimatingRows((prev) => ({ ...prev, [name]: "closing" }));
      setTimeout(() => {
        setExpandedRows((prev) => ({ ...prev, [name]: false }));
        setAnimatingRows((prev) => ({ ...prev, [name]: undefined }));
      }, 300);
    } else {
      setExpandedRows({ [name]: true });
      setAnimatingRows((prev) => ({ ...prev, [name]: "opening" }));
    }
  };

  useEffect(() => {
    setExpandedRows({});
    setAnimatingRows({});
  }, [selectedCategory]);

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent">
              {t("pending_purchase_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("pending_purchase_desc")}
            </p>
          </div>
          <button
            onClick={onOpenAddFromMasterModal}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold animate-hoverScale transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>{t("add_from_master_list")}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("search_master_item_placeholder")}
              className="w-full pl-9 pr-4 py-2 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp p-6">
        <div className="flex-grow overflow-y-auto hide-scrollbar space-y-3">
          {Object.keys(groupedByCategory).length === 0 && (
            <EmptyState
              icon={ShoppingBag}
              title={t("empty_pending_title")}
              description={t("empty_pending_text")}
            />
          )}
          {Object.entries(groupedByCategory).map(([categoryId, items], catIndex) => {
            const isExpanded = expandedRows[categoryId];
            const category = (categories || []).find((c) => c.id === categoryId);
            const subSortConfig = subSortConfigs[categoryId] || { key: "name", direction: "ascending" };
            const sortedSubItems = [...items].sort((a, b) => {
              const aValue = a[subSortConfig.key] || "";
              const bValue = b[subSortConfig.key] || "";
              const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
              const comparison = collator.compare(aValue.toString(), bValue.toString());
              return subSortConfig.direction === "ascending" ? comparison : -comparison;
            });

            return (
              <div key={categoryId} className="border-2 border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden animate-fadeIn" style={{ animationDelay: `${catIndex * 0.05}s` }}>
                <div onClick={() => toggleExpand(categoryId)} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 hover:from-gray-100 hover:to-gray-200 cursor-pointer transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-400 dark:to-gray-500 rounded-lg flex items-center justify-center shadow-md">
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{category?.name || categoryId}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{items.length} {t("label_masters")}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{isExpanded ? t("collapse") : t("expand")}</div>
                </div>

                {isExpanded && (
                  <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                    {sortedSubItems.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-slideInLeft border-l-4 border-transparent hover:border-gray-400" style={{ animationDelay: `${itemIndex * 0.03}s` }}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full flex-shrink-0"></div>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-gray-900 dark:text-white">{item.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{t("pending_purchase_item_desc")}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <input type="number" min="1" value={purchaseData[item.id]?.quantity || 1} onChange={(e) => handleDataChange(item.id, "quantity", e.target.value)} className="w-20 p-1.5 border-2 rounded-lg text-center text-xs dark:bg-gray-700 dark:border-gray-600" />
                          <input type="number" min="0" placeholder={t("enter_price")} value={purchaseData[item.id]?.price || ""} onChange={(e) => handleDataChange(item.id, "price", e.target.value)} className="w-28 p-1.5 border-2 rounded-lg text-right text-xs dark:bg-gray-700 dark:border-gray-600" />
                          <button onClick={() => handlePurchaseClick(item)} className="p-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900/20 rounded-lg transition-all duration-200" title={t("start_purchase")}><ShoppingCart className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteItem(item)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200" title={t("delete")}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PendingPurchaseView;
