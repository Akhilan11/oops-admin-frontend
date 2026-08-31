import { useState, useEffect, useCallback } from 'react';
import * as orderService from '../../../services/orderService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await orderService.getOrders(200);
      // Normalize: pages use o.id and o.date, backend uses _id/orderId/createdAt
      setOrders(
        res.data.orders.map((o) => ({
          ...o,
          id: o.orderId || o._id,
          date: o.createdAt,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch orders:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = useCallback(async (orderId, newStatus) => {
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      const updated = res.data.order;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...updated, id: updated.orderId || updated._id, date: updated.createdAt } : o
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err.message);
    }
  }, []);

  return { orders, loading, updateStatus, refetch: fetchOrders };
}
