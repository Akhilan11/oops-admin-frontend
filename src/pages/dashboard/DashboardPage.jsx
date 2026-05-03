import { useState } from 'react';
import { useProducts } from '../products/data/dataLayer';
import { useOrders } from '../orders/data/dataLayer';
import TimeFilter, { filterByPeriod } from '../../shared/TimeFilter';
import ExportCSV from '../../shared/ExportCSV';
import RevenueChart from './components/RevenueChart';
import OrderStatusChart from './components/OrderStatusChart';
import RecentOrders from './components/RecentOrders';
import TopProducts from './components/TopProducts';
import SoldOutProducts from './components/SoldOutProducts';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  useDashboardSeed,
  computeDashboardStats,
  computeRevenueByDay,
  computeOrderStatusBreakdown,
  computeTopProducts,
} from './data/dataLayer';

const DASHBOARD_CSV_COLUMNS = [
  { label: 'Order ID', accessor: (o) => o.id },
  { label: 'Date', accessor: (o) => formatDate(o.date) },
  { label: 'Customer', accessor: (o) => o.shipping?.fullName || '' },
  { label: 'Items', accessor: (o) => o.items?.length || 0 },
  { label: 'Total', accessor: (o) => o.total || 0 },
  { label: 'Payment', accessor: (o) => o.paymentMethod === 'prepaid' ? 'Online' : 'COD' },
  { label: 'Status', accessor: (o) => o.status },
];

export default function DashboardPage() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const [period, setPeriod] = useState('all');

  useDashboardSeed();

  const filteredOrders = filterByPeriod(orders, period);
  const stats = computeDashboardStats(products, filteredOrders);
  const revenueData = computeRevenueByDay(filteredOrders);
  const statusBreakdown = computeOrderStatusBreakdown(filteredOrders);
  const topProducts = computeTopProducts(filteredOrders);

  const chartStats = {
    totalRevenue: stats.totalRevenue,
    totalOrders: filteredOrders.length,
    avgOrderValue: stats.avgOrderValue,
    prepaidCount: stats.prepaidCount,
  };

  return (
    <div className="-mx-6 -mt-8 md:-mx-10 md:-mt-10 px-6 py-8 md:px-10 md:py-10 bg-[#fafafa] min-h-[calc(100vh-56px)]">
      {/* Header with filter + export */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-ash mb-2">[ overview ]</p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warmblack">Dashboard</h2>
        </div>
        <div className="flex items-center gap-3">
          <ExportCSV
            data={filteredOrders}
            columns={DASHBOARD_CSV_COLUMNS}
            filename={`dashboard-orders-${period}.csv`}
          />
          <TimeFilter value={period} onChange={setPeriod} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3">
          <RevenueChart data={revenueData} stats={chartStats} />
        </div>
        <div className="lg:col-span-2">
          <OrderStatusChart breakdown={statusBreakdown} totalOrders={filteredOrders.length} />
        </div>
      </div>

      {/* Bottom widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <RecentOrders orders={stats.recentOrders} />
        </div>
        <div className="lg:col-span-2">
          <TopProducts products={topProducts} totalRevenue={stats.totalRevenue} />
        </div>
        <div className="lg:col-span-1">
          <SoldOutProducts products={stats.soldOutProducts} />
        </div>
      </div>
    </div>
  );
}
