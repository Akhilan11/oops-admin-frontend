import { lazy, Suspense } from 'react';
const Chart = lazy(() => import('react-apexcharts'));
import { formatCurrency } from '../../../utils/formatters';

export default function RevenueChart({ data, stats }) {
  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Inter, system-ui, sans-serif',
      parentHeightOffset: 0,
      zoom: { enabled: false },
    },
    colors: ['#475569'],
    plotOptions: {
      bar: { borderRadius: 5, borderRadiusApplication: 'end', columnWidth: '50%' },
    },
    fill: { opacity: 1 },
    stroke: { show: false },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      padding: { left: 4, right: 4, top: -10, bottom: -4 },
    },
    xaxis: {
      categories: data.map((d) => d.x),
      labels: { style: { fontSize: '10px', fontWeight: 600, colors: '#9ca3af' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    tooltip: {
      enabled: true,
      y: { formatter: (val) => formatCurrency(val) },
      style: { fontSize: '12px' },
      theme: 'light',
      intersect: true,
      shared: false,
      followCursor: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const val = series[seriesIndex][dataPointIndex];
        const label = w.globals.categoryLabels[dataPointIndex] || w.globals.labels[dataPointIndex];
        return `<div style="padding: 8px 12px; font-family: Inter, system-ui, sans-serif;">
          <div style="font-size: 11px; color: #9ca3af; margin-bottom: 2px;">${label}</div>
          <div style="font-size: 14px; font-weight: 700; color: #0F0F0F;">Rs. ${Number(val).toLocaleString('en-IN')}</div>
        </div>`;
      },
    },
    states: {
      hover: { filter: { type: 'lighten', value: 0.15 } },
      active: { filter: { type: 'lighten', value: 0.2 } },
    },
  };

  const series = [{ name: 'Revenue', data: data.map((d) => d.y) }];

  return (
    <div className="rounded-2xl bg-white p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full flex flex-col">
      {/* Metrics */}
      <div className="flex flex-wrap items-end gap-x-10 gap-y-3 mb-2">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ash mb-1">Revenue</p>
          <p className="text-3xl font-extrabold tracking-tight text-warmblack">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="flex gap-5 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-ash">Orders</span>
            <span className="text-[13px] font-bold text-warmblack tabular-nums">{stats.totalOrders}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-ash">Avg</span>
            <span className="text-[13px] font-bold text-warmblack tabular-nums">{formatCurrency(stats.avgOrderValue)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-ash">Prepaid</span>
            <span className="text-[13px] font-bold text-warmblack tabular-nums">{stats.totalOrders > 0 ? Math.round((stats.prepaidCount / stats.totalOrders) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <Suspense fallback={<div className="h-[190px] flex items-center justify-center text-xs text-ash">Loading...</div>}>
          <Chart options={options} series={series} type="bar" height={190} />
        </Suspense>
      </div>
    </div>
  );
}
