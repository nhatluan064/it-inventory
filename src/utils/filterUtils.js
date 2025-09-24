// src/utils/filterUtils.js
// Utility functions for filtering inventory and allocated items

/**
 * Filter inventory items based on provided filters
 * @param {Array} inventoryItems - Array of inventory items to filter
 * @param {Object} filters - Filter criteria
 * @param {Function} t - Translation function
 * @returns {Array} Filtered inventory items
 */
export const filterInventoryItems = (inventoryItems, filters, t) => {
  return inventoryItems.filter((item) => {
    const { search, category, importDate, status, condition } = filters;
    const query = search.toLowerCase();

    // Search match
    const searchMatch =
      !query ||
      item.name?.toLowerCase().includes(query) ||
      item.serialNumber?.toLowerCase().includes(query);

    // Category match
    const categoryMatch = category === "all" || item.category === category;

    // Date match
    const dateMatch =
      !importDate ||
      new Date(item.importDate).toLocaleDateString("en-CA") === importDate;

    // Status match
    const statusMatch = status === "all" || item.status === status;

    // Condition match
    const getConditionKey = (cond) => {
      if (typeof cond === "object" && cond !== null) return cond.key;
      return cond;
    };
    const conditionMatch =
      condition === "all" || getConditionKey(item.condition) === condition;

    return (
      searchMatch &&
      categoryMatch &&
      dateMatch &&
      statusMatch &&
      conditionMatch
    );
  });
};

/**
 * Filter allocated items based on provided filters
 * @param {Array} equipment - Array of all equipment items
 * @param {Object} filters - Filter criteria
 * @param {Function} t - Translation function
 * @returns {Array} Filtered allocated items
 */
export const filterAllocatedItems = (equipment, filters, t) => {
  return equipment.filter((item) => {
    if (item.status !== "in-use") return false;

    const { search, category, department, handoverDate } = filters;
    const query = search.toLowerCase();
    const details = item.allocationDetails || {};

    // Search match
    const searchMatch =
      !query ||
      item.name?.toLowerCase().includes(query) ||
      item.serialNumber?.toLowerCase().includes(query) ||
      details.recipientName?.toLowerCase().includes(query) ||
      details.employeeId?.toLowerCase().includes(query);

    // Category match
    const categoryMatch = category === "all" || item.category === category;

    // Department match
    const departmentMatch =
      department === "all" || details.department === department;

    // Date match
    const dateMatch =
      !handoverDate ||
      new Date(details.handoverDate).toLocaleDateString("en-CA") ===
        handoverDate;

    return searchMatch && categoryMatch && departmentMatch && dateMatch;
  });
};

/**
 * Get filtered items by status
 * @param {Array} equipment - Array of all equipment items
 * @param {string} status - Status to filter by
 * @returns {Array} Items matching the status
 */
export const getItemsByStatus = (equipment, status) => {
  return equipment.filter((item) => item.status === status);
};

/**
 * Get inventory items (excluding certain statuses)
 * @param {Array} equipment - Array of all equipment items
 * @returns {Array} Inventory items
 */
export const getInventoryItems = (equipment) => {
  const excludedStatuses = ["pending-purchase", "purchasing", "purchased", "master"];
  return equipment.filter((item) => !excludedStatuses.includes(item.status));
};

/**
 * Default filter states
 */
export const DEFAULT_INVENTORY_FILTERS = {
  search: "",
  category: "all",
  importDate: "",
  status: "all",
  condition: "all",
  location: "all",
};

export const DEFAULT_ALLOCATED_FILTERS = {
  search: "",
  category: "all",
  department: "all",
  handoverDate: "",
  sortKey: "category",
  sortDirection: "asc",
};