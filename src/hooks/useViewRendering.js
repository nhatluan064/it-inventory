// src/hooks/useViewRendering.js
import { useMemo } from "react";
import { ROUTE_NAMES, VIEW_COMPONENTS } from "../constants/routes";

// Pages
import AccountPage from "../Pages/AccountPage";
import SettingsView from "../views/SettingsView";
import AdvancedSettingsView from "../views/AdvancedSettingsView";

export const useViewRendering = ({
  activeTab,
  isMobile,
  t,
  categories,
  departmentsList, // Thêm prop này
  positionsList, // Thêm prop này
  statusColors,
  statusLabels,
  inventory,
  modals,
  // Data props
  pendingPurchaseItems,
  purchasingItems,
  purchasedItems,
  maintenanceItems,
  liquidationItems,
  inventoryItems,
  filteredInventory,
  allocatedItems,
  masterItems,
  uniqueMasterItemsCount,
  // Filter props
  inventoryFilters,
  setInventoryFilters,
  allocatedFilters,
  setAllocatedFilters,
  // Other props
  handleTabClick,
  dashboardScrollPosition,
  setDashboardScrollPosition,
  currentUser,
  passwordReset,
  inventoryStatusChartData,
}) => {
  const viewProps = useMemo(
    () => ({
      t,
      categories,
      departmentsList,
      positionsList,
      statusColors,
      statusLabels,
    }),
    [t, categories, departmentsList, positionsList, statusColors, statusLabels]
  );

  const inventoryCategories = useMemo(() => {
    const allCategory = {
      id: "all",
      name: t("category_all"),
      key: "category_all",
    };
    return [allCategory, ...categories];
  }, [categories, t]);

  const mobileViewProps = useMemo(
    () => ({
      ...viewProps,
      onViewItem: (item) => modals.openModal("view", item),
      onEditItem: (item) => modals.openModal("addEdit", item),
      onAllocateItem: (item) => {
        modals.openModal("allocation", {
          ...item,
          departmentsList,
          positionsList,
        });
      },
      onDeleteItem: (item) =>
        modals.openModal("delete", item, { deleteType: "inventory" }),
    }),
    [viewProps, modals]
  );

  const renderCurrentView = () => {
    const currentTab = activeTab || ROUTE_NAMES.INVENTORY;

    // Check if we have a standard view component mapping
    const viewConfig = VIEW_COMPONENTS[currentTab];
    if (viewConfig) {
      const ViewComponent = isMobile ? viewConfig.mobile : viewConfig.desktop;

      // Handle specific view cases with their unique props
      switch (currentTab) {
        case ROUTE_NAMES.HOME:
          return (
            <ViewComponent
              {...viewProps}
              equipment={inventory.equipment}
              pendingPurchaseCount={pendingPurchaseItems.length}
              purchasingCount={purchasingItems.length}
              purchasedCount={purchasedItems.length}
              masterListCount={uniqueMasterItemsCount}
              reportsCount={inventory.transactions.length}
              setActiveTab={handleTabClick}
              scrollPosition={dashboardScrollPosition}
              setScrollPosition={setDashboardScrollPosition}
              chartData={inventoryStatusChartData}
              activityLogs={inventory.transactions}
            />
          );

        case ROUTE_NAMES.MASTER_LIST:
          return (
            <ViewComponent
              {...viewProps}
              allItems={masterItems}
              fullEquipmentList={inventory.equipment}
              onAddType={() => modals.openModal("type")}
              onEditItem={(item) => modals.openModal("type", item)}
              onQuickUpdateMasterCategory={(payload) => inventory.updateMasterItem(payload)}
              onDeleteItem={(item) =>
                modals.openModal("delete", item, { deleteType: "master" })
              }
            />
          );

        case ROUTE_NAMES.PENDING_PURCHASE:
          return (
            <ViewComponent
              {...viewProps}
              items={pendingPurchaseItems}
              onStartPurchase={inventory.startPurchasing}
              onDeleteItem={inventory.cancelOrRevertPurchase}
              onOpenAddFromMasterModal={() => modals.openModal("addFromMaster")}
            />
          );

        case ROUTE_NAMES.PURCHASING:
          if (isMobile) {
            return (
              <ViewComponent
                {...viewProps}
                items={purchasingItems}
                onUpdateStatus={inventory.confirmPurchased}
                onCancel={(item) => modals.openModal("cancelNote", item)}
              />
            );
          }
          return (
            <ViewComponent
              {...viewProps}
              items={purchasingItems}
              onUpdateStatus={inventory.confirmPurchased}
              onCancel={(type, item) =>
                type === "cancel-purchasing"
                  ? modals.openModal("cancelNote", item)
                  : inventory.cancelOrRevertPurchase(type, item)
              }
            />
          );

        case ROUTE_NAMES.PURCHASED:
          return (
            <ViewComponent
              {...viewProps}
              items={purchasedItems}
              onImportItem={inventory.importPurchasedItems}
              fullInventory={inventory.equipment}
            />
          );

        case ROUTE_NAMES.INVENTORY:
          if (isMobile) {
            return (
              <ViewComponent
                {...{ ...mobileViewProps, categories: inventoryCategories }}
                equipment={filteredInventory}
                unfilteredEquipment={inventoryItems}
                filters={inventoryFilters}
                setFilters={setInventoryFilters}
                onAddLegacyItem={() => modals.openModal("addEdit")}
              />
            );
          }
          return (
            <ViewComponent
              {...{ ...viewProps, categories: inventoryCategories }}
              equipment={filteredInventory}
              unfilteredEquipment={inventoryItems}
              filters={inventoryFilters}
              setFilters={setInventoryFilters}
              onEditItem={(item) => modals.openModal("addEdit", item)}
              onDeleteItem={(item) =>
                modals.openModal("delete", item, { deleteType: "inventory" })
              }
              onViewItem={(item) => modals.openModal("view", item)}
              onAllocateItem={(item) => {
                modals.openModal("allocation", {
                  ...item,
                  departmentsList,
                  positionsList,
                });
              }}
              onAddLegacyItem={() => modals.openModal("addEdit")}
            />
          );

        case ROUTE_NAMES.ALLOCATED:
          if (isMobile) {
            return (
              <ViewComponent
                {...mobileViewProps}
                items={allocatedItems}
                onRecallItem={(item) => modals.openModal("recall", item)}
                onMarkDamaged={(item) =>
                  modals.openModal("directMaintenanceNote", item)
                }
                filters={allocatedFilters}
                setFilters={setAllocatedFilters}
              />
            );
          }
          return (
            <ViewComponent
              {...viewProps} // Đã bao gồm onAllocateItem từ mobileViewProps nếu cần
              items={allocatedItems}
              unfilteredAllocatedItems={inventory.equipment.filter(
                (i) => i.status === "in-use"
              )}
              onRecallItem={(item) => modals.openModal("recall", item)}
              onMarkDamaged={(item) =>
                modals.openModal("directMaintenanceNote", item)
              }
              filters={allocatedFilters}
              setFilters={setAllocatedFilters}
            />
          );

        case ROUTE_NAMES.MAINTENANCE:
          return (
            <ViewComponent
              {...viewProps}
              items={maintenanceItems}
              onRepairComplete={(item) => modals.openModal("repairNote", item)}
              onMarkUnrepairable={(item) =>
                modals.openModal("delete", item, {
                  deleteType: "move-to-liquidation",
                })
              }
              onEditNote={(item) => modals.openModal("note", item)}
            />
          );

        case ROUTE_NAMES.LIQUIDATION:
          return (
            <ViewComponent
              {...viewProps}
              items={liquidationItems}
              onLiquidateItem={(item) =>
                modals.openModal("delete", item, { deleteType: "liquidate" })
              }
            />
          );

        case ROUTE_NAMES.REPORTS:
          return (
            <ViewComponent
              {...viewProps}
              transactions={inventory.transactions}
            />
          );

        case ROUTE_NAMES.SETTINGS:
          return <SettingsView {...viewProps} />;

        case ROUTE_NAMES.ADVANCED_SETTINGS:
          return (
            <AdvancedSettingsView
              {...viewProps}
              onBackupData={inventory.backupData}
              onResetData={() =>
                modals.openModal("delete", null, { deleteType: "reset" })
              }
              onDeleteLogs={() =>
                modals.openModal("delete", null, { deleteType: "delete_logs" })
              }
              onImportData={(e) => inventory.importData(e.target.files[0])}
            />
          );

        case ROUTE_NAMES.ACCOUNT:
          return (
            <AccountPage
              {...viewProps}
              currentUser={currentUser}
              onPasswordReset={passwordReset}
            />
          );

        default:
          return <ViewComponent {...viewProps} />;
      }
    }

    // Fallback for unknown routes
    return <div>View not found</div>;
  };

  return { renderCurrentView };
};
