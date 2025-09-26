// src/Pages/LoginPage.js
import React, { useState } from "react";
import { Package, Eye, EyeOff, Mail } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = ({
  onLogin,
  onGoogleSignIn,
  onPasswordReset,
  onSignUp,
  t,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Add submit animation
    e.target.classList.add('auth-login-submit');
    setTimeout(() => {
      e.target.classList.remove('auth-login-submit');
    }, 300);
    
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      // Debug: Log authentication error details
      console.error('Login error:', error.code, error.message);
      
      if (error.message === "EMAIL_NOT_VERIFIED") {
        toast.error(
          "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email của bạn!"
        );
      } else if (error.code === "auth/user-not-found") {
        toast.error("Tài khoản không tồn tại. Vui lòng kiểm tra lại email.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Mật khẩu không đúng. Vui lòng thử lại.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Định dạng email không hợp lệ.");
      } else if (error.code === "auth/network-request-failed") {
        toast.error("Lỗi kết nối mạng. Vui lòng kiểm tra internet.");
      } else {
        toast.error(`Lỗi đăng nhập: ${error.message || t("login_error_credentials")}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      toast.error(t("register_error_password_mismatch"));
      setIsLoading(false);
      return;
    }
    try {
      // Chỉ gọi hàm signUp, không cần xử lý gì thêm ở đây
      await onSignUp(email, password);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error(t("register_error_email_in_use"));
      } else {
        toast.error(error.message);
      }
      // Chỉ tắt loading nếu có lỗi, nếu thành công thì App.js sẽ chuyển trang
      setIsLoading(false);
    }
    // Không cần setIsLoading(false) ở đây nữa, vì nếu thành công App.js sẽ unmount component này
  };

  const handleGoogleClick = async () => {
    setIsGoogleLoading(true);
    try {
      await onGoogleSignIn();
    } catch (error) {
      toast.error(t("login_error_google"));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleResetClick = async () => {
    if (!email) {
      toast.error(t("login_enter_email_for_reset"));
      return;
    }
    try {
      await onPasswordReset(email);
      toast.success(t("login_password_reset_sent"));
    } catch (error) {
      toast.error(t("login_error_password_reset"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 auth-welcome-slide relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="flex flex-col items-center relative z-10">
          <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full auth-success-pulse">
            <Package className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-center text-gray-800 dark:text-gray-100 auth-success-celebration">
            IT Inventory
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mt-2 auth-profile-setup">
            {isRegistering
              ? t("register_welcome_message")
              : t("login_welcome_message")}
          </p>
        </div>

        <form
          onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("login_email")}
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("login_password")}
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("register_confirm_password")}
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end">
            {!isRegistering && (
              <button
                type="button"
                onClick={handleResetClick}
                className="text-sm text-blue-600 hover:underline"
              >
                {t("login_forgot_password")}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 ${
              isLoading ? 'auth-login-loading' : 'auth-login-submit'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center auth-loading-content">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="auth-loading-text">
                  {isRegistering ? t("registering_button") : t("logging_in")}
                </span>
              </div>
            ) : (
              <span className="auth-button-text">
                {isRegistering ? t("register_button") : t("login_button")}
              </span>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {t("login_or_continue_with")}
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleClick}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center py-3 px-4 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-200"
        >
          {isGoogleLoading ? (
            "..."
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              {t("login_with_google")}
            </>
          )}
        </button>

        <div className="text-sm text-center text-gray-600 dark:text-gray-400">
          {isRegistering ? (
            <>
              {t("register_has_account")}{" "}
              <button
                onClick={() => setIsRegistering(false)}
                className="font-medium text-blue-600 hover:underline"
              >
                {t("register_login_now")}
              </button>
            </>
          ) : (
            <>
              {t("login_no_account")}{" "}
              <button
                onClick={() => setIsRegistering(true)}
                className="font-medium text-blue-600 hover:underline"
              >
                {t("login_register_now")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
