// src/constants.js

export const categoryStructure = [
  { id: "all", tKey: "category_all" },
  { id: "pc", tKey: "category_pc" },
  { id: "mini-pc", tKey: "category_mini_pc" },
  { id: "laptop", tKey: "category_laptop" },
  { id: "monitor", tKey: "category_monitor" },
  { id: "keyboard", tKey: "category_keyboard" },
  { id: "mouse", tKey: "category_mouse" },
  { id: "printer", tKey: "category_printer" },
  { id: "label-printer", tKey: "category_label_printer" },
  { id: "photocopier", tKey: "category_photocopier" },
  { id: "printer-ink", tKey: "category_printer_ink" },
  { id: "network-device", tKey: "category_network_device" },
  { id: "network-cable", tKey: "category_network_cable" },
  { id: "other", tKey: "category_other" },
];

export const statusColors = {
  available:
    "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  "in-use": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  maintenance:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  liquidation: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  broken: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  "out-of-stock":
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  "pending-purchase":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  purchasing:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  purchased: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
};


// --- CẬP NHẬT DANH SÁCH CHỨC VỤ ---
export const positions = [
    { id: "position_president", tKey: "position_president" },
    { id: "position_chairman", tKey: "position_chairman" },
    { id: "position_vice_chairman", tKey: "position_vice_chairman" },
    { id: "position_general_director", tKey: "position_general_director" },
    { id: "position_deputy_general_director", tKey: "position_deputy_general_director" },
    { id: "position_director", tKey: "position_director" },
    { id: "position_affairs_director", tKey: "position_affairs_director" },
    { id: "position_foreman", tKey: "position_foreman" },
    { id: "position_assistant", tKey: "position_assistant" },
    { id: "position_manager", tKey: "position_manager" },
    { id: "position_deputy_manager", tKey: "position_deputy_manager" },
    { id: "position_specialist", tKey: "position_specialist" },
    { id: "position_staff", tKey: "position_staff" },
    { id: "position_worker", tKey: "position_worker" },
    { id: "position_janitor", tKey: "position_janitor" },
    { id: "position_intern", tKey: "position_intern" },
];

// --- CẬP NHẬT DANH SÁCH PHÒNG BAN ---
export const departments = [
    { id: "dept_bod", tKey: "dept_bod" },
    { id: "dept_director", tKey: "dept_director" },
    { id: "dept_hr_admin", tKey: "dept_hr_admin" },
    { id: "dept_general_affairs", tKey: "dept_general_affairs" }, // DÒNG MỚI
    { id: "dept_hse", tKey: "dept_hse" },
    { id: "dept_supply_chain", tKey: "dept_supply_chain" },
    { id: "dept_technical", tKey: "dept_technical" },
    { id: "dept_maintenance", tKey: "dept_maintenance" },
    { id: "dept_internal_control", tKey: "dept_internal_control" },
    { id: "dept_purchasing", tKey: "dept_purchasing" },
    { id: "dept_sales_policy", tKey: "dept_sales_policy" },
    { id: "dept_it", tKey: "dept_it" },
    { id: "dept_marketing", tKey: "dept_marketing" },
    { id: "dept_production", tKey: "dept_production" },
    { id: "dept_executive", tKey: "dept_executive" },
    { id: "dept_operation", tKey: "dept_operation" },
    { id: "dept_packaging", tKey: "dept_packaging" },
    { id: "dept_medical", tKey: "dept_medical" },
    { id: "dept_security", tKey: "dept_security" },
    { id: "dept_accounting", tKey: "dept_accounting" },
    { id: "dept_sales", tKey: "dept_sales" },
];