// src/hooks/useSort.js
import React, { useState, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

// Hàm naturalSort giữ nguyên...
const naturalSort = (a, b) => {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return collator.compare(a, b);
};

export const useSort = (
  items = [],
  initialSortConfig = { key: "name", direction: "ascending" }
) => {
  // ...Phần logic của useSort giữ nguyên...
  const [sortConfig, setSortConfig] = useState(initialSortConfig);

  const sortedItems = useMemo(() => {
    if (!items) return [];
    let sortableItems = [...items];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const getNestedValue = (obj, key) =>
          key.split(".").reduce((o, i) => (o ? o[i] : undefined), obj);

        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const isNumericA = isFinite(aValue) && aValue.toString().trim() !== "";
        const isNumericB = isFinite(bValue) && bValue.toString().trim() !== "";

        if (!isNumericA && isNumericB) {
          return -1;
        }
        if (isNumericA && !isNumericB) {
          return 1;
        }

        let comparison = 0;
        if (isNumericA && isNumericB) {
          comparison = parseFloat(aValue) - parseFloat(bValue);
        } else {
          comparison = naturalSort(aValue.toString(), bValue.toString());
        }
        
        return comparison * (sortConfig.direction === "ascending" ? 1 : -1);
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export const SortableHeader = ({ columns, requestSort, sortConfig, t }) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === "ascending") {
      return <ArrowUp className="w-4 h-4 ml-1 inline-block" />;
    }
    return <ArrowDown className="w-4 h-4 ml-1 inline-block" />;
  };

  // Bỏ thẻ <thead> ở ngoài, chỉ giữ lại <tr>
  return (
    <tr>
      {columns.map((col) => (
        <th
          key={col.key}
          scope="col"
          // ---- THAY ĐỔI TỪ px-3 THÀNH px-4 ----
          className={`px-4 py-3.5 font-medium text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap ${
            col.className || "text-left"
          } ${
            col.sortable
              ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none"
              : ""
          }`}
          onClick={() => col.sortable && requestSort(col.key)}
        >
          {t(col.label)}
          {col.sortable && getSortIcon(col.key)}
        </th>
      ))}
    </tr>
  );
};