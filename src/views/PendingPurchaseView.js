// src/views/PendingPurchaseView.js
import React, { useState } from "react";
import { ShoppingCart, Edit2, Trash2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

const PendingPurchaseView = ({
  items,
  onStartPurchase,
  onEditItem,
  onDeleteItem,
  onOpenAddFromMasterModal,
  categories,
  t,
}) => {
  const [purchaseData, setPurchaseData] = useState({});

  const handleDataChange = (id, field, value) => {
    setPurchaseData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // Hàm xử lý Mua cho từng thiết bị riêng lẻ
  const handlePurchaseClick = (item) => {
    const price = parseFloat(purchaseData[item.id]?.price);
    const quantity = parseInt(purchaseData[item.id]?.quantity, 10) || 1;

    if (!price || price <= 0) {
      toast.error(t("toast_price_is_required"));
      return;
    }
    
    const itemToPurchase = {
      id: item.id,
      quantity: quantity,
      price: price,
    };
    
    // onStartPurchase cần nhận vào một mảng, nên ta truyền mảng chứa 1 phần tử
    onStartPurchase([itemToPurchase]);
    setPurchaseData({});
  };

  // Component chứa nút Thêm mới, được căn giữa
  const AddNewButton = () => (
    <div className="flex items-center justify-center gap-2 px-6 py-3">
      <button
        onClick={onOpenAddFromMasterModal}
        className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900"
        title={t("add_from_master_list")}
      >
        {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
        <PlusCircle className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        {/* ĐÃ SỬA: text-xl -> text-lg */}
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {t("pending_purchase_list")}
        </h2>
        {/* ĐÃ SỬA: text-sm -> text-xs */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t("pending_purchase_desc")}
        </p>
      </div>

      {/* --- Giao diện Bảng cho Desktop --- */}
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
              <th
                className="px-6 py-3 text-center font-medium uppercase"
                style={{ width: "120px" }}
              >
                {t("purchase_quantity")}
              </th>
              <th
                className="px-6 py-3 text-right font-medium uppercase"
                style={{ width: "150px" }}
              >
                {t("price")} (VNĐ)
              </th>
              <th className="px-6 py-3 text-center font-medium uppercase">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {items && items.length > 0 ? (
              <>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 capitalize">
                      {(categories.find((c) => c.id === item.category) || {})
                        .name || item.category}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="1"
                        value={purchaseData[item.id]?.quantity || 1}
                        onChange={(e) =>
                          handleDataChange(item.id, "quantity", e.target.value)
                        }
                        className="w-20 p-1 border rounded-md text-right text-black text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={purchaseData[item.id]?.price || ""}
                        onChange={(e) =>
                          handleDataChange(item.id, "price", e.target.value)
                        }
                        className="w-32 p-1 border rounded-md text-right text-black text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
                        <button
                          onClick={() => handlePurchaseClick(item)}
                          className="p-2"
                          title={t("Mua")}
                        >
                          <ShoppingCart className="w-4 h-4 text-green-600 hover:text-green-400" />
                        </button>
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-2"
                          title={t("edit")}
                        >
                          <Edit2 className="w-4 h-4 text-blue-600 hover:text-blue-400" />
                        </button>
                        <button
                          onClick={() => onDeleteItem("delete-pending", item)}
                          className="p-2"
                          title={t("delete")}
                        >
                          <Trash2 className="w-4 h-4 text-red-600 hover:text-red-400"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                    <td colSpan="5">
                        <AddNewButton />
                    </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-12">
                  <p className="text-gray-500 text-sm">{t("no_data_available")}</p>
                  <div className="mt-4">
                      <AddNewButton />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- Giao diện Card cho Mobile (Đã cập nhật đầy đủ) --- */}
      <div className="md:hidden p-4 space-y-4">
        {items && items.length > 0 ? (
            <>
            {items.map((item) => (
                <div
                key={item.id}
                className="rounded-lg p-4 space-y-3 shadow bg-white dark:bg-gray-800"
                >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                        {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {(categories.find((c) => c.id === item.category) || {})
                            .name || item.category}
                        </p>
                    </div>
                    {/* --- Cụm nút hành động cho Mobile --- */}
                    <div className="flex space-x-1">
                        {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
                        <button
                            onClick={() => handlePurchaseClick(item)}
                            className="p-2"
                            title={t("Mua")}
                        >
                            <ShoppingCart className="w-4 h-4 text-green-500" />
                        </button>
                        <button
                            onClick={() => onEditItem(item)}
                            className="p-2"
                            title={t("edit")}
                        >
                            <Edit2 className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                            onClick={() => onDeleteItem("delete-pending", item)}
                            className="p-2"
                            title={t("delete")}
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t dark:border-gray-700">
                    <div>
                    {/* ĐÃ SỬA: text-sm -> text-xs */}
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("purchase_quantity")}
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={purchaseData[item.id]?.quantity || 1}
                        onChange={(e) =>
                        handleDataChange(item.id, "quantity", e.target.value)
                        }
                        className="w-full p-2 border rounded-md text-center dark:bg-gray-700 text-sm"
                    />
                    </div>
                    <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("price")} (VNĐ)
                    </label>
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={purchaseData[item.id]?.price || ""}
                        onChange={(e) =>
                        handleDataChange(item.id, "price", e.target.value)
                        }
                        className="w-full p-2 border rounded-md text-right dark:bg-gray-700 text-sm"
                    />
                    </div>
                </div>
                </div>
            ))}
            {/* Nút thêm mới ở dưới cho mobile */}
            <div className="pt-2">
                <AddNewButton />
            </div>
            </>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-sm">{t("no_data_available")}</p>
             <div className="mt-4">
                <AddNewButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPurchaseView;