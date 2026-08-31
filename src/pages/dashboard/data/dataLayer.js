import { useState, useEffect, useCallback } from 'react';
import * as dashboardService from '../../../services/dashboardService';

// No-op — seed is now handled by `npm run seed` on the backend
export function useDashboardSeed() {}

export function useDashboardData(period = 'all') {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, revenueRes, statusRes, topRes, recentRes] = await Promise.all([
        dashboardService.getStats(period),
        dashboardService.getRevenueByDay(period),
        dashboardService.getStatusBreakdown(period),
        dashboardService.getTopProducts(period, 5),
        dashboardService.getRecentOrders(5),
      ]);

      setStats(statsRes.data);
      setRevenueData(
        (revenueRes.data.data || []).map((d) => ({ x: d.label, y: d.revenue }))
      );

      // Convert array to object for the chart component
      const breakdownMap = {};
      (statusRes.data.data || []).forEach((d) => { breakdownMap[d.status] = d.count; });
      setStatusBreakdown(breakdownMap);

      setTopProducts(topRes.data.data || []);
      setRecentOrders(
        (recentRes.data.data || []).map((o) => ({ ...o, id: o.orderId || o._id, date: o.createdAt }))
      );
    } catch (err) {
      console.error('Failed to fetch dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { stats, revenueData, statusBreakdown, topProducts, recentOrders, loading };
}

// Legacy compat — these still work for pages that call them directly
export function computeDashboardStats(products, orders) {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status !== 'delivered').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const soldOutProducts = products.filter((p) => p.status === 'sold-out');
  const recentOrders = [...orders].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)).slice(0, 5);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const prepaidCount = orders.filter((o) => o.paymentMethod === 'prepaid').length;
  const codCount = orders.length - prepaidCount;
  return { totalRevenue, pendingOrders, deliveredOrders, soldOutProducts, recentOrders, avgOrderValue, prepaidCount, codCount };
}

export function computeRevenueByDay(orders) {
  const map = {};
  orders.forEach((o) => {
    const d = o.date || o.createdAt;
    const day = new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    map[day] = (map[day] || 0) + (o.total || 0);
  });
  return [...orders]
    .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt))
    .reduce((acc, o) => {
      const d = o.date || o.createdAt;
      const day = new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (!acc.find((item) => item.x === day)) acc.push({ x: day, y: map[day] });
      return acc;
    }, []);
}

export function computeOrderStatusBreakdown(orders) {
  const map = {};
  orders.forEach((o) => { map[o.status] = (map[o.status] || 0) + 1; });
  return map;
}

export function computeTopProducts(orders) {
  const map = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      const key = item.name;
      if (!map[key]) map[key] = { name: key, image: item.image, qty: 0, revenue: 0 };
      map[key].qty += item.qty || 1;
      map[key].revenue += (item.price || 0) * (item.qty || 1);
    });
  });
  return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
}
