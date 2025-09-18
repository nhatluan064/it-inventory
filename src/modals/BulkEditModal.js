// src/modals/BulkEditModal.js
import React, { useState, useEffect } from "react";
import { X, Layers, Hash } from "lucide-react";

const BulkEditModal = ({ show, onClose, onSubmit, group, categories, t }) => {
  const [category, setCategory] = useState("");
  const [serialNumbers, setSerialNumbers] = useState([]);

  useEffect(() => {
    if (show && group) {
      setCategory(group.category || "");
      // Tạo một bản sao của mảng SN để chỉnh sửa
      setSerialNumbers([...group.serialNumbers]);
    }
  }, [show, group]);

  if (!show || !group) return null;

  const handleSnChange = (index, value) => {
    const updatedSn = [...serialNumbers];
    updatedSn[index] = value;
    setSerialNumbers(updatedSn);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      category,
      serialNumbers,
    };
    onSubmit(group, formData);
    onClose();
  };

  const categoryOptions = categories.filter((c) => c.id !== "all");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Sửa hàng loạt: <span className="text-blue-500">{group.name}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-grow flex flex-col overflow-hidden"
        >
          <div className="overflow-y-auto pr-4 -mr-4 space-y-4">
            {/* --- TRƯỜNG DANH MỤC --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Layers className="w-4 h-4" /> {t("category")} (Áp dụng cho tất
                cả {group.groupedQuantity} thiết bị)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* --- DANH SÁCH SERIAL NUMBER --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300  flex items-center gap-2">
                <Hash className="w-4 h-4" /> {t("serial_number_sn")} (Chỉnh sửa
                từng số)
              </label>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border dark:border-gray-600 rounded-md p-2">
                {serialNumbers.map((sn, index) => (
                  <input
                    key={index}
                    type="text"
                    value={sn}
                    onChange={(e) => handleSnChange(index, e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 font-mono"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-auto flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {t("save_changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkEditModal;
