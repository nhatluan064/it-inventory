// src/modals/EquipmentDetailModal.js
import React, { useCallback } from "react";
import { X, Tag, Package, Hash, Calendar, CircleUser, Building, Milestone } from "lucide-react";

const EquipmentDetailModal = ({
  show,
  onClose,
  item,
  categories,
  statusLabels,
  statusColors, // Nhận thêm prop này từ App.js
  t,
}) => {
  // --- HELPER FUNCTIONS (Tái sử dụng từ InventoryView) ---
  const renderCondition = useCallback((item) => {
    if (!item.condition) return "---";
    if (typeof item.condition === "object" && item.condition.key) {
      const finalParams = { ...item.condition.params };
      if (finalParams.note && typeof finalParams.note === "object") {
        const noteObject = finalParams.note;
        finalParams.note = noteObject.isKey ? t(noteObject.value) : noteObject.value;
      }
      return t(item.condition.key, finalParams);
    }
    const conditionText = t(String(item.condition));
    return item.isRecalled ? t("recalled_prefix", { conditionText }) : conditionText;
  }, [t]);

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "N/A";
    return new Intl.NumberFormat(t("locale_string"), { style: "currency", currency: "VND" }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(t("locale_string"));
  };
  
  if (!show || !item) {
    return null;
  }

  const category = categories.find((c) => c.id === item.category);
  const details = item.allocationDetails || {};

  const DetailRow = ({ icon: Icon, label, value, valueClassName = "" }) => (
    <div className="flex items-start">
      <Icon className="w-4 h-4 text-gray-400 mr-3 mt-1 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-sm font-medium text-gray-800 dark:text-gray-200 break-words ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t("device_details")}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto pr-4 -mr-4">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <DetailRow icon={Package} label={t("category")} value={category?.name || "N/A"} />
              <DetailRow icon={Hash} label={t("serial_number_sn")} value={item.serialNumber || "N/A"} valueClassName="font-mono" />
              <DetailRow icon={Calendar} label={t("import_date")} value={formatDate(item.importDate)} />
              <DetailRow icon={Tag} label={t("price")} value={formatCurrency(item.price)} />
              <DetailRow icon={Milestone} label={t("condition")} value={renderCondition(item)} />
              <div>
                <div className="flex items-start">
                    <Milestone className="w-4 h-4 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t("status")}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status] || "bg-gray-100"}`}>
                            {statusLabels[item.status] || "N/A"}
                        </span>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          {item.status === 'in-use' && details.recipientName && (
            <div className="mt-6 pt-4 border-t dark:border-gray-700">
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">{t("Thông tin bàn giao")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DetailRow icon={CircleUser} label={t("recipient")} value={`${details.recipientName} (${details.employeeId})`} />
                <DetailRow icon={Building} label={t("department")} value={t(details.department)} />
                <DetailRow icon={Milestone} label={t("position")} value={t(details.position)} />
                <DetailRow icon={Calendar} label={t("handover_date")} value={formatDate(details.handoverDate)} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailModal;