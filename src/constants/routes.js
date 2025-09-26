// src/constants/routes.js
// Cấu hình route mapping và view rendering

// Desktop Views
import InventoryView from "../views/InventoryView";
import ReportsView from "../views/ReportsView";
import SettingsView from "../views/SettingsView";
import AdvancedSettingsView from "../views/AdvancedSettingsView";
import PurchasingView from "../views/PurchasingView";
import PurchasedView from "../views/PurchasedView";
import AllocatedView from "../views/AllocatedView";
import PendingPurchaseView from "../views/PendingPurchaseView";
import MasterListView from "../views/MasterListView";
import MaintenanceView from "../views/MaintenanceView";
import LiquidationView from "../views/LiquidationView";
import HomeView from "../views/HomeView";

// Mobile Views
import MobileInventoryView from "../views/Mobile/MobileInventoryView";
import MobileMasterListView from "../views/Mobile/MobileMasterListView";
import MobilePendingPurchaseView from "../views/Mobile/MobilePendingPurchaseView";
import MobilePurchasingView from "../views/Mobile/MobilePurchasingView";
import MobilePurchasedView from "../views/Mobile/MobilePurchasedView";
import MobileAllocatedView from "../views/Mobile/MobileAllocatedView";
import MobileMaintenanceView from "../views/Mobile/MobileMaintenanceView";
import MobileLiquidationView from "../views/Mobile/MobileLiquidationView";
import MobileReportsView from "../views/Mobile/MobileReportsView";

// Pages
import AccountPage from "../Pages/AccountPage";

// Route configuration mapping
export const ROUTE_NAMES = {
  HOME: "home",
  MASTER_LIST: "masterList", 
  PENDING_PURCHASE: "pendingPurchase",
  PURCHASING: "purchasing",
  PURCHASED: "purchased",
  INVENTORY: "inventory",
  ALLOCATED: "allocated",
  MAINTENANCE: "maintenance",
  LIQUIDATION: "liquidation",
  REPORTS: "reports",
  SETTINGS: "settings",
  ADVANCED_SETTINGS: "advancedSettings",
  ACCOUNT: "account"
};

// Desktop và Mobile view mapping
export const VIEW_COMPONENTS = {
  [ROUTE_NAMES.HOME]: {
    desktop: HomeView,
    mobile: HomeView // Home view sử dụng chung
  },
  [ROUTE_NAMES.MASTER_LIST]: {
    desktop: MasterListView,
    mobile: MobileMasterListView
  },
  [ROUTE_NAMES.PENDING_PURCHASE]: {
    desktop: PendingPurchaseView,
    mobile: MobilePendingPurchaseView
  },
  [ROUTE_NAMES.PURCHASING]: {
    desktop: PurchasingView,
    mobile: MobilePurchasingView
  },
  [ROUTE_NAMES.PURCHASED]: {
    desktop: PurchasedView,
    mobile: MobilePurchasedView
  },
  [ROUTE_NAMES.INVENTORY]: {
    desktop: InventoryView,
    mobile: MobileInventoryView
  },
  [ROUTE_NAMES.ALLOCATED]: {
    desktop: AllocatedView,
    mobile: MobileAllocatedView
  },
  [ROUTE_NAMES.MAINTENANCE]: {
    desktop: MaintenanceView,
    mobile: MobileMaintenanceView
  },
  [ROUTE_NAMES.LIQUIDATION]: {
    desktop: LiquidationView,
    mobile: MobileLiquidationView
  },
  [ROUTE_NAMES.REPORTS]: {
    desktop: ReportsView,
    mobile: MobileReportsView
  },
  [ROUTE_NAMES.SETTINGS]: {
    desktop: SettingsView,
    mobile: SettingsView // Settings view sử dụng chung
  },
  [ROUTE_NAMES.ADVANCED_SETTINGS]: {
    desktop: AdvancedSettingsView,
    mobile: AdvancedSettingsView // Advanced Settings view sử dụng chung
  },
  [ROUTE_NAMES.ACCOUNT]: {
    desktop: AccountPage,
    mobile: AccountPage // Account page sử dụng chung
  }
};

// Navigation items configuration
export const NAV_ITEMS = [
  { 
    id: ROUTE_NAMES.HOME,
    titleKey: "home",
    icon: "Home"
  },
  { 
    id: ROUTE_NAMES.MASTER_LIST,
    titleKey: "master_list",
    icon: "Database"
  },
  { 
    id: ROUTE_NAMES.PENDING_PURCHASE,
    titleKey: "pending_purchase",
    icon: "Clock"
  },
  { 
    id: ROUTE_NAMES.PURCHASING,
    titleKey: "purchasing",
    icon: "ShoppingCart"
  },
  { 
    id: ROUTE_NAMES.PURCHASED,
    titleKey: "purchased",
    icon: "Package"
  },
  { 
    id: ROUTE_NAMES.INVENTORY,
    titleKey: "inventory_management",
    icon: "Package2"
  },
  { 
    id: ROUTE_NAMES.ALLOCATED,
    titleKey: "allocated_devices",
    icon: "UserCheck"
  },
  { 
    id: ROUTE_NAMES.MAINTENANCE,
    titleKey: "maintenance",
    icon: "Wrench"
  },
  { 
    id: ROUTE_NAMES.LIQUIDATION,
    titleKey: "liquidation",
    icon: "Trash2"
  },
  { 
    id: ROUTE_NAMES.REPORTS,
    titleKey: "reports",
    icon: "FileText"
  }
];