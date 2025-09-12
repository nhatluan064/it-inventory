// src/hooks/useSort.js
import React, { useState, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

// Hàm sắp xếp tự nhiên (natural sort) được giữ lại để sắp xếp nhóm có chữ
const naturalSort = (a, b) => {
  // Sử dụng Intl.Collator để so sánh chuỗi một cách tự nhiên, coi số là số
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return collator.compare(a, b);
};

/**
 * A custom hook for sorting arrays of objects with advanced logic.
 * @param {Array} items - The initial array of items to sort.
 * @param {Object} initialSortConfig - The initial sorting configuration.
 * @returns {Object} - An object containing sorted items and sorting utilities.
 */
export const useSort = (
  items = [],
  initialSortConfig = { key: "name", direction: "ascending" }
) => {
  const [sortConfig, setSortConfig] = useState(initialSortConfig);

  const sortedItems = useMemo(() => {
    if (!items) return [];
    let sortableItems = [...items];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        // Hàm tiện ích để lấy giá trị từ các key lồng nhau (ví dụ: 'details.name')
        const getNestedValue = (obj, key) =>
          key.split(".").reduce((o, i) => (o ? o[i] : undefined), obj);

        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);

        // Xử lý trường hợp giá trị là null hoặc undefined để tránh lỗi
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // --- LOGIC SẮP XẾP TÙY CHỈNH THEO YÊU CẦU ---

        // Bước 1: Phân loại giá trị (là chuỗi thuần số hay chuỗi có chữ)
        // isFinite kiểm tra xem một giá trị có phải là số hữu hạn không.
        // Chuỗi "001" sẽ được coi là số, còn "RAIL-001" thì không.
        const isNumericA = isFinite(aValue) && aValue.toString().trim() !== "";
        const isNumericB = isFinite(bValue) && bValue.toString().trim() !== "";

        // Bước 2: Ưu tiên nhóm - đưa chuỗi có chữ lên trước chuỗi chỉ có số
        if (!isNumericA && isNumericB) {
          // A là chuỗi có chữ, B là chuỗi số -> A đi trước
          return -1;
        }
        if (isNumericA && !isNumericB) {
          // A là chuỗi số, B là chuỗi có chữ -> A đi sau
          return 1;
        }

        // Bước 3: Sắp xếp bên trong từng nhóm
        let comparison = 0;
        if (isNumericA && isNumericB) {
          // Nếu cả 2 đều là chuỗi số, so sánh chúng như những con số thực sự
          comparison = parseFloat(aValue) - parseFloat(bValue);
        } else {
          // Nếu cả 2 đều là chuỗi có chữ, dùng hàm sắp xếp tự nhiên
          comparison = naturalSort(aValue.toString(), bValue.toString());
        }
        
        // Cuối cùng, áp dụng chiều sắp xếp (tăng dần/giảm dần)
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


/**
 * Component hiển thị tiêu đề bảng có thể sắp xếp.
 * @param {Array} columns - Cấu hình các cột của bảng.
 * @param {Function} requestSort - Hàm để yêu cầu sắp xếp.
 * @param {Object} sortConfig - Cấu hình sắp xếp hiện tại.
 * @param {Function} t - Hàm dịch thuật.
 * @returns {JSX.Element} - Component tiêu đề bảng.
 */
export const SortableHeader = ({ columns, requestSort, sortConfig, t }) => {
  // Hàm để lấy biểu tượng sắp xếp (mũi tên lên/xuống)
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === "ascending") {
      return <ArrowUp className="w-4 h-4 ml-1 inline-block" />;
    }
    return <ArrowDown className="w-4 h-4 ml-1 inline-block" />;
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0 z-10">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            scope="col"
            className={`px-6 py-3 font-medium text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap ${
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
    </thead>
  );
};