// src/views/PurchasedView.js
import React, { useState } from "react";
import toast from "react-hot-toast";
// 1. Import thêm icon mới từ lucide-react
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        {/* ĐÃ SỬA: text-xl -> text-lg */}
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {t("purchased_list")}
        </h2>
        {/* ĐÃ SỬA: text-sm -> text-xs */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t("purchased_desc")}
        </p>
      </div>

      <div className="overflow-x-auto hidden md:block">
        {/* ĐÃ SỬA: text-sm -> text-xs */}
        <table className="w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left font-medium uppercase">
                {t("device_name")}
              </th>
              <th className="px-6 py-3 text-left font-medium uppercase">
                {t("category")}
              </th>
              <th className="px-6 py-3 text-right font-medium uppercase">
                {t("price")} (VNĐ)
              </th>
              <th className="px-6 py-3 text-right font-medium uppercase">
                {t("quantity")}
              </th>
              <th className="px-6 py-3 text-left font-medium uppercase">
                {t("serial_number_sn")}
              </th>
              <th className="px-6 py-3 text-center font-medium uppercase">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {items && items.length > 0 ? (
              items.map((item) => {
                const isImporting = importingIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`transition-opacity duration-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      isImporting ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 capitalize">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {item.purchaseQuantity}
                    </td>
                    <td className="px-6 py-4">
                      {/* ĐÃ SỬA: text-sm -> text-xs */}
                      <input
                        type="text"
                        value={serialNumbers[item.id] || ""}
                        onChange={(e) =>
                          handleSnChange(item.id, e.target.value)
                        }
                        placeholder={t("add_multiple_sn_placeholder")}
                        className="w-full text-xs p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleImportClick(item)}
                        disabled={isImporting}
                        title={t("import_to_inventory")}
                        className={`p-2 rounded-full transition-colors duration-300 ${
                          isImporting
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
                        {isImporting ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <ArrowDownToLine className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <p className="text-sm">{t("no_data_available")}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-4 space-y-4">
        {items && items.length > 0 ? (
          items.map((item) => {
            const isImporting = importingIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`rounded-lg p-4 space-y-3 shadow transition-all duration-500 ${
                  isImporting
                    ? "opacity-0"
                    : "opacity-100 bg-white dark:bg-gray-800"
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
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      isImporting
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                  >
                    {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
                    {isImporting ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <ArrowDownToLine className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {/* ĐÃ SỬA: text-sm -> text-xs */}
                <div className="text-xs text-gray-700 dark:text-gray-300 grid grid-cols-2 gap-x-4 pt-2 border-t dark:border-gray-700">
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
                  {/* ĐÃ SỬA: text-sm -> text-xs */}
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("serial_number_sn")}
                  </label>
                  <textarea
                    value={serialNumbers[item.id] || ""}
                    onChange={(e) => handleSnChange(item.id, e.target.value)}
                    placeholder={t("add_multiple_sn_placeholder")}
                    className="w-full text-xs p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-sm">{t("no_data_available")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedView;