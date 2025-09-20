import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Search,
  Wrench,
  Filter,
} from "lucide-react";
import { useSort } from "../hooks/useSort";
import { departments } from "../constants";

const animationStyles = `
  @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 1000px; } }
  @keyframes slideUp { from { opacity: 1; max-height: 1000px; } to { opacity: 0; max-height: 0; } }
  .animate-slideDown { animation: slideDown 0.4s ease-out forwards; }
  .animate-slideUp { animation: slideUp 0.3s ease-in forwards; }
`;

const AllocatedView = ({
  items,
  unfilteredAllocatedItems,
  onRecallItem,
  onMarkDamaged,
  categories,
  filters,
  setFilters,
  t,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [animatingRows, setAnimatingRows] = useState({});
  const [subSortConfigs, setSubSortConfigs] = useState({});

  const {
    items: sortedItems,
    requestSort: requestMainSort,
    sortConfig: mainSortConfig,
  } = useSort(items, {
    key: "category", 
    direction: "ascending",
  });

  const groupedByCategory = useMemo(() => {
    return sortedItems.reduce((acc, item) => {
        const key = item.category || "uncategorized";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
  }, [sortedItems]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(t("locale_string"));
  const handleFilterChange = (e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  
  const categoryCounts = useMemo(() => {
    if (!unfilteredAllocatedItems) return {};
    return unfilteredAllocatedItems.reduce((acc, item) => {
      if(item && item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
      return acc;
    }, {});
  }, [unfilteredAllocatedItems]);

  const departmentOptions = useMemo(() => [{ id: "all", tKey: "all" }, ...departments], []);

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
    setSubSortConfigs(prevConfigs => {
        const currentConfig = prevConfigs[groupName] || {};
        let direction = 'ascending';
        if (currentConfig.key === key && currentConfig.direction === 'ascending') {
            direction = 'descending';
        }
        return { ...prevConfigs, [groupName]: { key, direction } };
    });
  };

  const subGridCols = "grid grid-cols-12 gap-x-4 items-center";

  return (
    <div className="h-full flex flex-col gap-6">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {t("allocated_list")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("allocated_desc")}
            </p>
          </div>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="md:hidden p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><Filter className="w-5 h-5" /></button>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end ${isFilterOpen ? "grid" : "hidden md:grid"}`}>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-2">{t("search")}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="search" type="text" placeholder={t("search_inventory_placeholder")} className="w-full pl-9 pr-4 py-2 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600" value={filters.search} onChange={handleFilterChange}/>
            </div>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-2">{t("category")}</label>
            <select name="category" className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600" value={filters.category} onChange={handleFilterChange}>
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{`${cat.name} (${cat.id === "all" ? unfilteredAllocatedItems.length : categoryCounts[cat.id] || 0})`}</option>))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-2">{t("department")}</label>
            <select name="department" className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600" value={filters.department} onChange={handleFilterChange}>
              {departmentOptions.map((dept) => (<option key={dept.id} value={dept.id}>{t(dept.tKey)}</option>))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-2">{t("handover_date")}</label>
            <input name="handoverDate" type="date" className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600" value={filters.handoverDate} onChange={handleFilterChange}/>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          <table className="w-full text-xs table-fixed">
            <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3.5 text-left font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 cursor-pointer select-none" onClick={() => requestMainSort('category')}>{t("category")}{mainSortConfig.key === 'category' && (mainSortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}</th>
                <th className="px-4 py-3.5 text-right font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 w-48">Số lượng xuất kho</th>
                <th className="px-4 py-3.5 text-center font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {Object.entries(groupedByCategory).map(([categoryId, items]) => {
                const isOpening = animatingRows[categoryId] === "opening";
                const isClosing = animatingRows[categoryId] === "closing";
                const category = categories.find(c => c.id === categoryId);
                const subSortConfig = subSortConfigs[categoryId] || { key: 'name', direction: 'ascending' };
                const sortedSubItems = [...items].sort((a, b) => {
                    const getNestedValue = (obj, key) => key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
                    const aValue = getNestedValue(a, subSortConfig.key) || '';
                    const bValue = getNestedValue(b, subSortConfig.key) || '';
                    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
                    const comparison = collator.compare(aValue.toString(), bValue.toString());
                    return subSortConfig.direction === 'ascending' ? comparison : -comparison;
                });

                return (
                  <React.Fragment key={categoryId}>
                    <tr className="bg-gray-50/50 dark:bg-gray-900/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50" onClick={() => toggleExpand(categoryId)}>
                      <td className="px-4 py-3 font-semibold capitalize">{category?.name || categoryId}</td>
                      <td className="px-4 py-3 text-right font-semibold">{items.length}</td>
                      <td className="px-4 py-3 text-center"><span className="text-sm text-blue-500">{expandedRows[categoryId] ? "▲" : "▼"}</span></td>
                    </tr>
                    {(expandedRows[categoryId] || isClosing) && (
                      <tr className="bg-white dark:bg-gray-800">
                        <td colSpan={3} className={`p-0 overflow-hidden ${isOpening ? "animate-slideDown" : ""} ${isClosing ? "animate-slideUp" : ""}`}>
                          <div className="p-2 text-xs">
                            <div className={`${subGridCols} bg-gray-100 dark:bg-gray-900/50 p-2 rounded-t-md font-medium`}>
                              <div className="col-span-3 text-left cursor-pointer select-none" onClick={() => requestSubSort(categoryId, 'name')}>{t("device_name")}{subSortConfig.key === 'name' && (subSortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}</div>
                              <div className="col-span-2 text-left cursor-pointer select-none" onClick={() => requestSubSort(categoryId, 'serialNumber')}>{t("serial_number_sn")}{subSortConfig.key === 'serialNumber' && (subSortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}</div>
                              <div className="col-span-2 text-left cursor-pointer select-none" onClick={() => requestSubSort(categoryId, 'allocationDetails.recipientName')}>{t("recipient")}{subSortConfig.key === 'allocationDetails.recipientName' && (subSortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}</div>
                              <div className="col-span-2 text-left cursor-pointer select-none" onClick={() => requestSubSort(categoryId, 'allocationDetails.department')}>{t("department")}{subSortConfig.key === 'allocationDetails.department' && (subSortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}</div>
                              <div className="col-span-1 text-left cursor-pointer select-none" onClick={() => requestSubSort(categoryId, 'allocationDetails.handoverDate')}>{t("handover_date")}{subSortConfig.key === 'allocationDetails.handoverDate' && (subSortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}</div>
                              <div className="col-span-2 text-center font-medium text-gray-800">{t("actions")}</div>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                              {sortedSubItems.map(item => (
                                <div key={item.id} className={`${subGridCols} py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
                                  <div className="col-span-3 text-left truncate font-semibold">{item.name}</div>
                                  <div className="col-span-2 text-left truncate font-mono">{item.serialNumber || "N/A"}</div>
                                  <div className="col-span-2 text-left truncate">{item.allocationDetails?.recipientName || "N/A"}</div>
                                  <div className="col-span-2 text-left truncate">{item.allocationDetails?.department ? t(item.allocationDetails.department) : "N/A"}</div>
                                  <div className="col-span-1 text-left truncate">{formatDate(item.allocationDetails?.handoverDate)}</div>
                                  <div className="col-span-2 flex items-center justify-center space-x-1">
                                    <button onClick={() => onRecallItem(item)} className="p-2 rounded-lg text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30" title={t("recall_device")}><RotateCcw className="w-4 h-4" /></button>
                                    <button onClick={() => onMarkDamaged(item)} className="p-2 rounded-lg text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30" title={t("maintenance")}><Wrench className="w-4 h-4" /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllocatedView;