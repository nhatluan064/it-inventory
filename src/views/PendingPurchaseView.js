import React, { useState, useMemo, useEffect } from "react";
import { ShoppingCart, Trash2, Plus, Search } from "lucide-react";
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
  const [animatingRows, setAnimatingRows] = useState({});
  const [subSortConfigs, setSubSortConfigs] = useState({});

  // State để quản lý sorting category riêng
  const [categorySortConfig, setCategorySortConfig] = useState({
    key: "category",
    direction: "ascending",
  });

  const { items: sortedItems } = useSort(items, {
    key: "name",
    direction: "ascending",
  });

  // Handler riêng cho category sort
  const handleCategorySort = () => {
    setCategorySortConfig((prev) => ({
      key: "category",
      direction: prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const categoryOptions = useMemo(() => {
    const allOption = { id: "all", name: t("all") };
    return [allOption, ...categories.filter(c => c.id !== "all")];
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

    const grouped = itemsToGroup.reduce((acc, item) => {
      const key = item.category || "uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    // Sắp xếp các categories theo thứ tự
    const sortedGrouped = {};
    const sortedCategoryIds = Object.keys(grouped).sort((a, b) => {
      const categoryA = categories.find((c) => c.id === a)?.name || a;
      const categoryB = categories.find((c) => c.id === b)?.name || b;

      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      });
      const comparison = collator.compare(categoryA, categoryB);

      return categorySortConfig.direction === "ascending"
        ? comparison
        : -comparison;
    });

    sortedCategoryIds.forEach((categoryId) => {
      sortedGrouped[categoryId] = grouped[categoryId];
    });

    return sortedGrouped;
  }, [sortedItems, categories, categorySortConfig, selectedCategory, searchQuery]);

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
      setExpandedRows((prev) => ({ ...prev, [name]: true }));
      setAnimatingRows((prev) => ({ ...prev, [name]: "opening" }));
    }
  };

  const requestSubSort = (groupName, key) => {
    setSubSortConfigs((prevConfigs) => {
      const currentConfig = prevConfigs[groupName] || {};
      let direction = "ascending";
      if (
        currentConfig.key === key &&
        currentConfig.direction === "ascending"
      ) {
        direction = "descending";
      }
      return { ...prevConfigs, [groupName]: { key, direction } };
    });
  };

  // Reset expanded rows when category filter changes
  useEffect(() => {
    setExpandedRows({});
    setAnimatingRows({});
  }, [selectedCategory]);

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">{/* Page transition */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6 animate-slideInDown">{/* Header animation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              {t("pending_purchase_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("pending_purchase_desc")}
            </p>
          </div>
          <button
            onClick={onOpenAddFromMasterModal}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold animate-hoverScale transition-all duration-200"
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

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden animate-slideInUp">
        <div className="flex-grow overflow-y-auto hide-scrollbar">
          <table className="w-full text-xs table-fixed">
            <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th
                  className="px-4 py-3.5 text-left font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 cursor-pointer select-none w-1/2"
                  onClick={handleCategorySort}
                >
                  {t("category")}
                  {categorySortConfig.direction === "ascending" ? " ▲" : " ▼"}
                </th>
                <th className="px-4 py-3.5 text-center font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 w-24">
                  {t("quantity")}
                </th>
                <th className="px-4 py-3.5 text-center font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 w-32">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {Object.entries(groupedByCategory).map(([categoryId, items]) => {
                const isOpening = animatingRows[categoryId] === "opening";
                const isClosing = animatingRows[categoryId] === "closing";
                const category = categories.find((c) => c.id === categoryId);
                const subSortConfig = subSortConfigs[categoryId] || {
                  key: "name",
                  direction: "ascending",
                };
                const sortedSubItems = [...items].sort((a, b) => {
                  const aValue = a[subSortConfig.key] || "";
                  const bValue = b[subSortConfig.key] || "";
                  const collator = new Intl.Collator(undefined, {
                    numeric: true,
                    sensitivity: "base",
                  });
                  const comparison = collator.compare(
                    aValue.toString(),
                    bValue.toString()
                  );
                  return subSortConfig.direction === "ascending"
                    ? comparison
                    : -comparison;
                });

                return (
                  <React.Fragment key={categoryId}>
                    <tr
                      className="bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer animate-fadeInUp transition-all duration-300"
                      style={{
                        animationDelay: `${
                          Object.keys(groupedByCategory).indexOf(categoryId) *
                          0.1
                        }s`,
                      }}
                      onClick={() => toggleExpand(categoryId)}
                    >
                      <td className="px-4 py-3 font-semibold capitalize">
                        <span>{category?.name || categoryId}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        <div className="flex flex-col items-center">
                          <span>{items.length}</span>
                          <span className="text-gray-400 dark:text-gray-500 text-[9px]">
                            {t("label_devices")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="text-xs text-gray-500">
                          {expandedRows[categoryId] ? "−" : "+"}
                        </div>
                      </td>
                    </tr>
                    {(expandedRows[categoryId] || isClosing) && (
                      <tr>
                        <td
                          colSpan={3}
                          className={`p-0 overflow-hidden ${
                            isOpening ? "animate-slideDown" : ""
                          } ${isClosing ? "animate-slideUp" : ""}`}
                        >
                          <div className="bg-gray-50 dark:bg-gray-800/50 border-l-4 border-purple-200 dark:border-purple-700">
                            <div className="px-8 py-4">
                              <div className="grid grid-cols-12 gap-x-4 items-center p-2 rounded-t-md font-bold italic text-gray-600 dark:text-gray-400 text-xs border-b border-gray-200 dark:border-gray-700">
                                <div
                                  className="col-span-4 cursor-pointer flex items-center"
                                  onClick={() =>
                                    requestSubSort(categoryId, "name")
                                  }
                                >
                                  <span className="ml-4">
                                    📦 {t("device_name")}
                                  </span>
                                </div>
                                <div className="col-span-2 text-center">
                                  {t("purchase_quantity")}
                                </div>
                                <div className="col-span-3 text-center">
                                  {t("price")} (VNĐ)
                                </div>
                                <div className="col-span-3 text-center">
                                  {t("actions")}
                                </div>
                              </div>
                              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {sortedSubItems.map((item, itemIndex) => (
                                  <div
                                    key={item.id}
                                    className="grid grid-cols-12 gap-x-4 items-center py-3 hover:bg-gray-100 dark:hover:bg-gray-700/30 animate-slideInLeft transition-all duration-300 border-l-2 border-transparent hover:border-purple-300"
                                    style={{
                                      animationDelay: `${itemIndex * 0.05}s`,
                                    }}
                                  >
                                    <div className="col-span-4 flex items-center gap-3">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0 ml-4"></div>
                                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                                        {item.name}
                                      </span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                      <input
                                        type="number"
                                        min="1"
                                        value={purchaseData[item.id]?.quantity || 1}
                                        onChange={(e) =>
                                          handleDataChange(
                                            item.id,
                                            "quantity",
                                            e.target.value
                                          )
                                        }
                                        className="w-full p-1.5 border-2 rounded-lg text-center text-xs dark:bg-gray-700 dark:border-gray-600"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                    <div className="col-span-3 text-center">
                                      <input
                                        type="number"
                                        min="0"
                                        placeholder={t("enter_price")}
                                        value={purchaseData[item.id]?.price || ""}
                                        onChange={(e) =>
                                          handleDataChange(
                                            item.id,
                                            "price",
                                            e.target.value
                                          )
                                        }
                                        className="w-full p-1.5 border-2 rounded-lg text-right text-xs dark:bg-gray-700 dark:border-gray-600"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                    <div className="col-span-3 flex items-center justify-center gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePurchaseClick(item);
                                        }}
                                        className="p-2 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg animate-hoverScale transition-all duration-200"
                                        title={t("start_purchase")}
                                      >
                                        <ShoppingCart className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDeleteItem(item);
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg animate-hoverScale transition-all duration-200"
                                        title={t("delete")}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingPurchaseView;
