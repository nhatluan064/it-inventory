// src/views/PurchasedView.js
import React, { useState } from "react";
import toast from "react-hot-toast";
import { ArrowDownToLine, CheckCircle } from "lucide-react";

const PurchasedView = ({
  items,
  onImportItem,
  categories,
  t,
  fullInventory,
}) => {
  const [importingIds, setImportingIds] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState({});

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "0";
    return new Intl.NumberFormat(t("locale_string")).format(amount);
  };

  const handleSnChange = (id, value) => {
    setSerialNumbers((prev) => ({ ...prev, [id]: value }));
  };

  const handleImportClick = (item) => {
    const snString = serialNumbers[item.id] || "";
    if (!snString.trim()) {
      toast.error(t("toast_sn_is_required"));
      return;
    }
    const serials = snString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (serials.length !== item.purchaseQuantity) {
      toast.error(
        t("toast_sn_quantity_mismatch", {
          snCount: serials.length,
          purchaseCount: item.purchaseQuantity,
        })
      );
      return;
    }
    const uniqueSerials = new Set(serials.map((s) => s.toLowerCase()));
    if (uniqueSerials.size !== serials.length) {
      toast.error(t("toast_duplicate_sn_error"));
      return;
    }
    const lowercasedSerials = serials.map((s) => s.toLowerCase());
    const existingSnInInventory = fullInventory.find(
      (invItem) =>
        invItem.serialNumber &&
        lowercasedSerials.includes(invItem.serialNumber.toLowerCase())
    );
    if (existingSnInInventory) {
      toast.error(
        t("toast_sn_already_exists_in_inventory", {
          sn: existingSnInInventory.serialNumber,
        })
      );
      return;
    }
    setImportingIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      onImportItem(item, serials);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-scaleIn">
      {/* --- HEADER CARD --- */}
      <div className="glass-effect bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 bg-clip-text text-transparent">
          {t("purchased_list")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t("purchased_desc")}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-teal-500 to-green-500 mt-2 rounded-full" />
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hidden md:block border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3.5 text-left font-medium uppercase">
                  {t("device_name")}
                </th>
                <th className="px-4 py-3.5 text-left font-medium uppercase">
                  {t("category")}
                </th>
                <th className="px-4 py-3.5 text-right font-medium uppercase">
                  {t("price")} (VNĐ)
                </th>
                <th className="px-4 py-3.5 text-center font-medium uppercase">
                  {t("quantity")}
                </th>
                <th className="px-4 py-3.5 text-left font-medium uppercase w-2/5">
                  {t("serial_number_sn")}
                </th>
                <th className="px-4 py-3.5 text-center font-medium uppercase">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items && items.length > 0 ? (
                items.map((item, index) => {
                  const isImporting = importingIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`transition-opacity duration-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        isImporting ? "opacity-0" : "opacity-100"
                      } ${
                        index % 2 === 0
                          ? "bg-gray-50/30 dark:bg-gray-900/20"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                        {item.name}
                      </td>
                      <td className="px-4 py-3.5 capitalize text-gray-600 dark:text-gray-300">
                        {(categories.find((c) => c.id === item.category) || {})
                          .name || item.category}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-gray-600 dark:text-gray-300">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-gray-800 dark:text-gray-200">
                        {item.purchaseQuantity}
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          type="text"
                          value={serialNumbers[item.id] || ""}
                          onChange={(e) =>
                            handleSnChange(item.id, e.target.value)
                          }
                          placeholder={t("add_multiple_sn_placeholder")}
                          className="w-full text-xs p-2 border-2 rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleImportClick(item)}
                          disabled={isImporting}
                          title={t("import_to_inventory")}
                          className={`p-2.5 rounded-xl transition-all duration-300 ${
                            isImporting
                              ? "bg-green-500 text-white scale-110"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          }`}
                        >
                          {isImporting ? (
                            <CheckCircle className="w-5 h-5 animate-pulse" />
                          ) : (
                            <ArrowDownToLine className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <p className="text-sm text-gray-500">
                      {t("no_data_available")}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden p-4 space-y-4">
        {items && items.length > 0 ? (
          items.map((item) => {
            const isImporting = importingIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 space-y-3 transition-all duration-500 ${
                  isImporting ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </p>
                  </div>
                  <button
                    onClick={() => handleImportClick(item)}
                    disabled={isImporting}
                    title={t("import_to_inventory")}
                    className={`p-2.5 rounded-xl transition-all duration-300 -mt-2 -mr-2 ${
                      isImporting
                        ? "bg-green-500 text-white"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {isImporting ? (
                      <CheckCircle className="w-5 h-5 animate-pulse" />
                    ) : (
                      <ArrowDownToLine className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 grid grid-cols-2 gap-x-4 pt-3 border-t dark:border-gray-700">
                  <p>
                    <strong>{t("quantity")}:</strong>{" "}
                    <span className="font-semibold">
                      {item.purchaseQuantity}
                    </span>
                  </p>
                  <p>
                    <strong>{t("price")}:</strong>{" "}
                    <span className="font-semibold">
                      {formatCurrency(item.price)} VNĐ
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("serial_number_sn")}
                  </label>
                  <textarea
                    value={serialNumbers[item.id] || ""}
                    onChange={(e) => handleSnChange(item.id, e.target.value)}
                    placeholder={t("add_multiple_sn_placeholder")}
                    className="w-full text-xs p-2 border-2 rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-sm">{t("no_data_available")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedView;
