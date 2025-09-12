import React, { useState } from "react";
import { Lock, Key } from "lucide-react";
import toast from "react-hot-toast";

const CreatePasswordModal = ({ show, onSubmit, onCancel, email }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      return setError("Mật khẩu phải có ít nhất 6 ký tự.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp.");
    }

    setIsLoading(true);
    const toastId = toast.loading("Đang xử lý...");

    try {
      // Gọi hàm onSubmit được truyền từ App.js
      await onSubmit(newPassword);
      // Thông báo thành công sẽ được hiển thị ở App.js sau khi đăng xuất
      toast.dismiss(toastId);
    } catch (err) {
      if (err.code === "auth/weak-password") {
        setError("Mật khẩu quá yếu. Vui lòng thử lại.");
      } else {
        setError("Không thể tạo mật khẩu. Vui lòng thử lại sau.");
      }
      toast.error("Tạo mật khẩu thất bại!", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Hoàn tất Đăng ký</h2>
          <p className="text-sm text-gray-600 mt-2">
            Tài khoản <span className="font-semibold">{email}</span> đã được xác
            thực. Vui lòng tạo mật khẩu để đăng nhập.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <div className="relative mt-1">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                required
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div className="pt-4 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? "Đang lưu..." : "Tạo Mật khẩu"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePasswordModal;
