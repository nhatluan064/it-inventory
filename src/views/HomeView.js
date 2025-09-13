// src/Pages/HomePage.js
import React from 'react';
import ViewHeader from '../components/ViewHeader';

const HomePage = ({ t }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <ViewHeader title={t('home_page_title')} subtitle={t('home_page_subtitle')} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('welcome_to_app')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('home_page_content')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Version 1.0.0 (13/09/2025)
        </h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
            <li>Phát hành phiên bản đầu tiên của ứng dụng Quản lý Kho IT.</li>
            <li>Các tính năng cốt lõi bao gồm quy trình mua hàng, quản lý kho, cấp phát thiết bị và báo cáo.</li>
            <li>Hỗ trợ giao diện sáng/tối và đa ngôn ngữ (Tiếng Việt, English, 中文).</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
