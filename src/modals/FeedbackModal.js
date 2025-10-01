// src/modals/FeedbackModal.js
import React, { useState } from "react";
import {
  X,
  Star,
  Bug,
  Lightbulb,
  Settings,
  MessageCircle,
  Send,
  Heart,
  Sparkles,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const FeedbackModal = ({ isOpen, onClose, t, user: _user }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("suggestion");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    {
      id: "bug",
      icon: Bug,
      label: t("feedback_bug"),
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      id: "suggestion",
      icon: Lightbulb,
      label: t("feedback_suggestion"),
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      id: "improvement",
      icon: Settings,
      label: t("feedback_improvement"),
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      id: "other",
      icon: MessageCircle,
      label: t("feedback_other"),
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration
      const serviceId = "service_ws5imwo"; // You'll need to create this in EmailJS dashboard
      const templateId = "template_jvsrdms"; // Template ID for feedback emails
      const publicKey = "ECFdf3n-EdfGnTObK"; // Public key from EmailJS

      const templateParams = {
        user_name: _user?.displayName || _user?.email || "Anonymous User",
        user_email: _user?.email || "anonymous@example.com",
        rating: rating,
        category: category,
        title: title,
        description: description,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString("vi-VN"), // Ngày theo định dạng Việt Nam
        time: new Date().toLocaleTimeString("vi-VN"), // Giờ theo định dạng Việt Nam
        user_agent: navigator.userAgent,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Auto close after success
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error("Error sending feedback:", error);
      setIsSubmitting(false);
      toast.error("Failed to send feedback. Please try again.");
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setCategory("suggestion");
    setTitle("");
    setDescription("");
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300); // Delay reset to avoid flicker during close animation
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full mx-4 max-h-[85vh] overflow-y-auto animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t("feedback_title")}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("feedback_subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isSubmitted ? (
          // Success State
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("feedback_success_title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("feedback_success_message")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Rating Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("feedback_rating")}
              </label>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`transition-all duration-200 transform hover:scale-110 ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 animate-pulse"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className="w-6 h-6"
                      fill={
                        star <= (hoverRating || rating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {rating > 0 && (
                  <span className="animate-fadeIn">
                    {rating === 1 && t("rating_1_star")}
                    {rating === 2 && t("rating_2_star")}
                    {rating === 3 && t("rating_3_star")}
                    {rating === 4 && t("rating_4_star")}
                    {rating === 5 && t("rating_5_star")}
                  </span>
                )}
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("feedback_category")}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2 border rounded-lg transition-all duration-200 transform hover:scale-105 ${
                        isSelected
                          ? `${cat.bgColor} ${cat.borderColor} shadow-md`
                          : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mb-0.5 mx-auto ${
                          isSelected ? cat.color : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          isSelected
                            ? cat.color
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("feedback_title")}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("feedback_title_placeholder")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 text-sm"
                required
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("feedback_description")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("feedback_description_placeholder")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 resize-none text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting || !title || !description || rating === 0
                }
                className={`flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isSubmitting ? "animate-pulse" : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("submitting")}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Send className="w-3 h-3" />
                    {t("submit_feedback")}
                  </div>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
