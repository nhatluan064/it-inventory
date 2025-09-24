// src/utils/chartSetup.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Kiểm tra xem đã đăng ký chưa để tránh lỗi re-register
let isRegistered = false;

if (!isRegistered) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartDataLabels
  );
  isRegistered = true;
}

// Cấu hình default để tránh canvas conflicts
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

export default ChartJS;