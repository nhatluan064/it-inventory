// src/modals/ReportDetailsModal.js
import React from "react";
import { X, Info } from "lucide-react";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-1 text-sm">
    <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">{label}</span>
    <span className="font-medium text-gray-900 dark:text-gray-100 text-right break-words max-w-[70%]">{value ?? "---"}</span>
  </div>
);

const ReportDetailsModal = ({ show, onClose, trans, t, categories }) => {
  if (!show || !trans) return null;

  const typeKey = `${trans.type}-${trans.reason}`;
  const actionText = t(typeKey) || typeKey;

  const renderDetails = () => {
    if (!trans.details) return "---";
    const d = trans.details;

    // Prefer readable keys
    const map = {
      recipientName: t("recipient"),
      giverName: t("giver_name") || "Giver Name",
      giverPosition: t("giver_position") || "Giver Position",
      giverDepartment: t("giver_department") || "Department",
      department: t("department"),
      position: t("position"),
  note: t("note"),
  serials: t("serials"),
      returnCondition: t("returnCondition"),
      recalledFrom: t("recalled_from_user") || t("recalledFrom"),
      from: t("from_user") || t("recalledFrom"),
      to: t("recipient"),
      category: t("category"),
    };

    return Object.entries(d).map(([k, v]) => {
      let value = v;
      if (k === "serials" && Array.isArray(v)) value = v.join(", ");
      if (k === "category" && categories) {
        const cat = categories.find((c) => c.id === v);
        value = cat ? cat.name : v;
      }
      const label = map[k] || t(k) || k;
      return <Row key={k} label={label} value={String(value)} />;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">
              {t("activity_details") || "Activity Details"}
            </h3>
          </div>
          <button
            aria-label={t("close")}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-2">
          <Row label={t("timestamp")} value={new Date(trans.timestamp).toLocaleString(t("locale_string"))} />
          <Row label={t("action")} value={actionText} />
          <Row label={t("object")} value={trans.itemName} />
          <Row label={t("quantity")} value={trans.quantity} />
          <Row label={t("performed_by")} value={trans.user} />

          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">{t("details")}</h4>
            <div className="divide-y dark:divide-gray-700">
              {renderDetails()}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900/40 border-t dark:border-gray-700 flex justify-end">
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            onClick={onClose}
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
