// src/views/HomeView.js
import React from "react";
import StatusChart from "../components/StatusChart";
import ChartWrapper from "../components/ChartWrapper";
import {
  LazyDailyActivityChart,
  LazyMonthlyTrendChart,
  LazyCategoryDistributionChart,
  LazyTopDevicesChart,
  LazyWrapper,
} from "../components/Performance/LazyComponents";
import { ChartLoadingSkeleton } from "../components/LoadingStates/GlobalLoader";
import PageTransition from "../components/PageTransition";

const HomeView = React.memo(
  ({
    t,
    equipment,
    chartData, 
    activityLogs, 
  }) => {
    return (
      <PageTransition animationType="zoom" enableStagger={true}>
        <div className="h-full overflow-y-auto">
          <div className="space-y-6 p-1">
            {/* Page Transition Animation */}
            <div>
            {/* --- KHOẢNG BIỂU ĐỒ THỐNG KÊ --- */}
            <div className="space-y-6">
              {/* Row 1: Biểu đồ tròn + Biểu đồ phân bố danh mục */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper
                  title={t("info_chart_title")}
                  hasData={
                    chartData && chartData.data && chartData.data.length > 0
                  }
                >
                  <StatusChart chartData={chartData} />
                </ChartWrapper>

                <ChartWrapper hasData={equipment && equipment.length > 0}>
                  <LazyWrapper
                    component={LazyCategoryDistributionChart}
                    fallback={<ChartLoadingSkeleton />}
                    equipment={equipment}
                  />
                </ChartWrapper>
              </div>

              {/* Row 2: Top Devices + Daily Activity */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartWrapper hasData={equipment && equipment.length > 0}>
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
              <ChartWrapper hasData={activityLogs && Array.isArray(activityLogs)}>
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
      </div>
    </PageTransition>
    );
  }
);

HomeView.displayName = "HomeView";

export default HomeView;
