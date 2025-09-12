// src/modals/ViewModal.js

import React from 'react';
import { X } from 'lucide-react';

const ViewModal = ({ isOpen, onClose, item, statusLabels, statusColors }) => {
  if (!isOpen || !item) return null;

  // Hàm định dạng tiền tệ Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Chi tiết thiết bị</h3>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Tên thiết bị</p>
            <p>{item.name}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Vị trí</p>
            <p>{item.location || 'Có tồn kho'}</p> {/* Vị trí mặc định khi đã nhập kho */}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Danh mục</p>
            <p className="capitalize">{item.category}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Số lượng</p>
            <p>{item.quantity}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Trạng thái</p>
            <p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[item.status] || item.status}
              </span>
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Giá trị</p>
            <p>{item.price ? formatCurrency(item.price) : '0 VNĐ'}</p>
          </div>
          {item.serialNumber && ( // Chỉ hiển thị nếu có serial number
            <div className="col-span-2">
              <p className="font-semibold text-gray-800 dark:text-gray-200">Số serial</p>
              <p>{item.serialNumber}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;