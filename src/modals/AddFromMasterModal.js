// src/modals/AddFromMasterModal.js
import React, { useState } from "react";
import { Search, PlusCircle, X } from "lucide-react";

const AddFromMasterModal = ({
  show,
  onClose,
  masterItems,
  onAddItem,
  pendingItems,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!show) return null;

  const filteredItems = masterItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingItemNames = pendingItems.map((item) => item.name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {t("add_to_purchase_request_from_master")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t("search_master_item_placeholder")}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
          {filteredItems.length > 0 ? (
            <ul className="divide-y dark:divide-gray-700">
              {filteredItems.map((item) => {
                const isPending = pendingItemNames.includes(item.name);
                return (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {item.category}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddItem(item)}
                      disabled={isPending}
                      className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors ${
                        isPending
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900"
                      }`}
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{isPending ? t("requested") : t("add")}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p>{t("no_master_items_found")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFromMasterModal;
