// src/views/HomeView.js
import React from "react";
import ViewHeader from "../components/ViewHeader";
import StatusChart from "../components/StatusChart";
import ChartWrapper from "../components/ChartWrapper";
import { 
  LazyDailyActivityChart,
  LazyMonthlyTrendChart, 
  LazyCategoryDistributionChart,
  LazyTopDevicesChart,
  LazyWrapper
} from "../components/Performance/LazyComponents";
import { ChartLoadingSkeleton } from "../components/LoadingStates/GlobalLoader";

const HomeView = React.memo(({
  t,
  equipment,
  pendingPurchaseCount,
  purchasingCount,
  purchasedCount,
  masterListCount,
  reportsCount,
  setActiveTab,
  chartData, // <-- THÊM PROP NÀY
  activityLogs, // <-- THÊM PROP ACTIVITY LOGS
}) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 animate-scaleIn p-1">
      {/* --- INFO SECTION --- */}
      <div className="space-y-6">
        <ViewHeader
          title={t("home_page_title")}
          subtitle={t("home_page_subtitle")}
        />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("welcome_to_app")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("home_page_content")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
            Version 1.0.0 (17/09/2025)
          </h3>
          <ul className="text-sm list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
            <li>Phát hành phiên bản đầu tiên của ứng dụng Quản lý Kho IT.</li>
            <li>
              Các tính năng cốt lõi bao gồm quy trình mua hàng, quản lý kho, cấp
              phát thiết bị và báo cáo.
            </li>
            <li>
              Hỗ trợ giao diện sáng/tối và đa ngôn ngữ (Tiếng Việt, English,
              中文).
            </li>
            <li>Giao diện được nâng cấp toàn diện với phong cách hiện đại.</li>
          </ul>
        </div>
      </div>
      {/* --- KHOẢNG BIỂU ĐỒ THỐNG KÊ --- */}
      <div className="space-y-6">
        {/* Row 1: Biểu đồ tròn + Biểu đồ phân bố danh mục */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWrapper 
            title={t("info_chart_title")}
            hasData={chartData && chartData.data && chartData.data.length > 0}
          >
            <StatusChart chartData={chartData} />
          </ChartWrapper>

          <ChartWrapper 
            hasData={equipment && equipment.length > 0}
          >
            <LazyWrapper 
              component={LazyCategoryDistributionChart} 
              fallback={<ChartLoadingSkeleton />}
              equipment={equipment} 
            />
          </ChartWrapper>
        </div>

        {/* Row 2: Top Devices + Daily Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartWrapper 
            hasData={equipment && equipment.length > 0}
          >
            <LazyWrapper 
              component={LazyTopDevicesChart} 
              fallback={<ChartLoadingSkeleton />}
              equipment={equipment} 
            />
          </ChartWrapper>
          
          <ChartWrapper 
            hasData={activityLogs && Array.isArray(activityLogs)}
          >
            <LazyWrapper 
              component={LazyDailyActivityChart} 
              fallback={<ChartLoadingSkeleton />}
              activityLogs={activityLogs} 
            />
          </ChartWrapper>
        </div>

        {/* Row 3: Biểu đồ xu hướng 30 ngày */}
        <ChartWrapper 
          hasData={activityLogs && Array.isArray(activityLogs)}
        >
          <LazyWrapper 
            component={LazyMonthlyTrendChart} 
            fallback={<ChartLoadingSkeleton />}
            activityLogs={activityLogs} 
            equipment={equipment} 
          />
        </ChartWrapper>
      </div>
      </div>
    </div>
  );
});

HomeView.displayName = 'HomeView';

export default HomeView;
