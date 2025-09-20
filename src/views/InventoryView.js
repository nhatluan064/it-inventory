import React, { useMemo, useState, useCallback } from "react";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Plus,
  Filter,
  Package,
  Layers,
  User,
} from "lucide-react";
import { useSort } from "../hooks/useSort";

const animationStyles = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
  @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 1000px; } }
  @keyframes slideUp { from { opacity: 1; max-height: 1000px; } to { opacity: 0; max-height: 0; } }
  .animate-slideDown { animation: slideDown 0.4s ease-out forwards; }
  .animate-slideUp { animation: slideUp 0.3s ease-in forwards; }
`;

const InventoryView = ({
  equipment,
  unfilteredEquipment,
  categories,
  statusLabels,
  filters,
  setFilters,
  onEditItem,
  onDeleteItem,
  onViewItem,
  onAllocateItem,
  onAddLegacyItem,
  t,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [animatingRows, setAnimatingRows] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [subSortConfigs, setSubSortConfigs] = useState({});

  const { items: sortedEquipment } = useSort(equipment, {
    key: "name",
    direction: "ascending",
  });

  const categoryCounts = useMemo(() => {
    if (!unfilteredEquipment) return {};
    return unfilteredEquipment.reduce((acc, item) => {
      if (item && item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
      return acc;
    }, {});
  }, [unfilteredEquipment]);

  const uniqueStatuses = useMemo(() => {
    if (!unfilteredEquipment) return [];
    return [...new Set(unfilteredEquipment.map((item) => item.status))];
  }, [unfilteredEquipment]);
  
  const groupedEquipment = useMemo(() => {
    return sortedEquipment.reduce((acc, item) => {
      const key = item.name || "Unnamed";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [sortedEquipment]);

  const renderCondition = useCallback((item) => {
    if (!item || !item.condition) return "---";
    if (typeof item.condition === "object" && item.condition.key) {
        const finalParams = { ...item.condition.params };
        if (finalParams.note && typeof finalParams.note === "object") {
            finalParams.note = finalParams.note.isKey ? t(finalParams.note.value) : finalParams.note.value;
        }
        return t(item.condition.key, finalParams);
    }
    return t(String(item.condition));
  }, [t]);

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "N/A";
    return new Intl.NumberFormat(t("locale_string"), { style: "currency", currency: "VND" }).format(amount);
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

  const handleAction = useCallback(async (action, item) => {
      const actionKey = `${action}-${item.id}`;
      setLoadingStates((prev) => ({ ...prev, [actionKey]: true }));
      try {
        if (action === "allocate") await onAllocateItem(item);
        else if (action === "view") await onViewItem(item);
        else if (action === "edit") await onEditItem(item);
        else if (action === "delete") await onDeleteItem(item);
      } finally {
        setTimeout(() => {
          setLoadingStates((prev) => ({ ...prev, [actionKey]: false }));
        }, 300);
      }
  }, [onAllocateItem, onViewItem, onEditItem, onDeleteItem]);
  
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

  const handleFilterChange = (e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const subGridCols = "grid grid-cols-12 gap-x-4 items-center";

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      {/* Header và Filter */}
      <div className="flex-shrink-0 glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{t("inventory_list")}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("inventory_desc")}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            <button onClick={onAddLegacyItem} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold">
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">{t("import_unlisted_device")}</span>
            </button>
          </div>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end ${isMobileFilterOpen ? "grid" : "hidden md:grid"}`}>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold mb-2">{t("search")}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="search" type="text" placeholder={t("search_inventory_placeholder")} className="w-full pl-9 pr-4 py-2 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600" value={filters.search} onChange={handleFilterChange} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">{t("category")}</label>
            <select name="category" className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600" value={filters.category} onChange={handleFilterChange}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{`${cat.name} (${cat.id === "all" ? unfilteredEquipment.length : (categoryCounts && categoryCounts[cat.id]) || 0})`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">{t("status")}</label>
            <select name="status" className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600" value={filters.status} onChange={handleFilterChange}>
              <option value="all">{t("all")}</option>
              {uniqueStatuses.map((status) => (<option key={status} value={status}>{statusLabels[status] || status}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">{t("import_date")}</label>
            <input name="importDate" type="date" className="w-full py-2 px-3 border-2 rounded-lg text-sm dark:bg-gray-700/50 dark:border-gray-600" value={filters.importDate} onChange={handleFilterChange}/>
          </div>
        </div>
      </div>
      
      {/* Bảng chính */}
      <div className="flex-grow flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          <table className="w-full text-xs table-fixed">
            <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3.5 text-left font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2">{t("device_name")}</th>
                <th className="px-4 py-3.5 text-right font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 w-32">{t("quantity")}</th>
                <th className="px-4 py-3.5 text-center font-medium uppercase text-gray-500 dark:text-gray-400 border-b-2 w-24">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {Object.keys(groupedEquipment).length > 0 ? (
                Object.entries(groupedEquipment).map(([name, items]) => {
                  const isOpening = animatingRows[name] === "opening";
                  const isClosing = animatingRows[name] === "closing";
                  const subSortConfig = subSortConfigs[name] || { key: 'serialNumber', direction: 'ascending' };
                  const sortedSubItems = [...items].sort((a, b) => {
                      const aValue = a[subSortConfig.key] || '';
                      const bValue = b[subSortConfig.key] || '';
                      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
                      const comparison = collator.compare(aValue.toString(), bValue.toString());
                      return subSortConfig.direction === 'ascending' ? comparison : -comparison;
                  });
                  return (
                    <React.Fragment key={name}>
                      <tr className="bg-gray-50/50 dark:bg-gray-900/30 cursor-pointer" onClick={() => toggleExpand(name)}>
                        <td className="px-4 py-3 font-semibold">{name}</td>
                        <td className="px-4 py-3 text-right font-semibold">{items.length}</td>
                        <td className="px-4 py-3 text-center"><span className="text-sm text-blue-500">{expandedRows[name] ? "▲" : "▼"}</span></td>
                      </tr>
                      {(expandedRows[name] || isClosing) && (
                        <tr className="bg-white dark:bg-gray-800">
                          <td colSpan={3} className={`p-0 overflow-hidden ${isOpening ? "animate-slideDown" : ""} ${isClosing ? "animate-slideUp" : ""}`}>
                            <div className="p-2 text-xs">
                                <div className={`${subGridCols} bg-gray-100 dark:bg-gray-900/50 p-2 rounded-t-md font-medium`}>
                                    <div className="col-span-2 cursor-pointer" onClick={() => requestSubSort(name, 'serialNumber')}>SN {subSortConfig.key === 'serialNumber' && (subSortConfig.direction === 'ascending' ? '▲' : '▼')}</div>
                                    <div className="col-span-2 cursor-pointer" onClick={() => requestSubSort(name, 'status')}>{t("status")} {subSortConfig.key === 'status' && (subSortConfig.direction === 'ascending' ? '▲' : '▼')}</div>
                                    <div className="col-span-2">{t("user_in_use")}</div>
                                    <div className="col-span-3 cursor-pointer" onClick={() => requestSubSort(name, 'condition')}>{t("condition")} {subSortConfig.key === 'condition' && (subSortConfig.direction === 'ascending' ? '▲' : '▼')}</div>
                                    <div className="col-span-1">{t("price")}</div>
                                    <div className="col-span-2 text-center">{t("actions")}</div>
                                </div>
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {sortedSubItems.map((item) => (
                                        <div key={item.id} className={`${subGridCols} py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
                                            <div className="col-span-2 truncate font-mono">{item.serialNumber || "N/A"}</div>
                                            <div className="col-span-2 truncate">{statusLabels[item.status] || item.status}</div>
                                            <div className="col-span-2 truncate">{item.status === "in-use" ? (<div className="flex items-center gap-2"><User className="w-4 h-4 text-blue-400 flex-shrink-0" /><span className="truncate">{item.allocationDetails?.recipientName}</span></div>) : ( <span className="text-gray-500 italic">{t("user_not_use")}</span> )}</div>
                                            <div className="col-span-3 truncate">{renderCondition(item)}</div>
                                            <div className="col-span-1 truncate font-mono">{formatCurrency(item.price)}</div>
                                            <div className="col-span-2 flex items-center justify-center">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <button onClick={() => handleAction("allocate", item)} disabled={item.status !== "available"} className="p-2 rounded-lg text-blue-500 hover:bg-blue-100 disabled:opacity-30"><LogOut className="w-4 h-4" /></button>
                                                    <button onClick={() => handleAction("view", item)} className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-100"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => handleAction("edit", item)} className="p-2 rounded-lg text-amber-500 hover:bg-amber-100"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleAction("delete", item)} className="p-2 rounded-lg text-red-500 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr><td colSpan={3} className="text-center py-16"><Package className="w-12 h-12 mx-auto text-gray-300" /><p className="mt-3 text-sm text-gray-500">{t("no_devices_match_search")}</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;