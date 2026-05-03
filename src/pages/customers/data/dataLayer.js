import { useState, useEffect, useCallback } from 'react';
import api from '../../../utils/api';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await api.get('/admin/customers?limit=200');
      setCustomers(
        res.data.customers.map((c) => ({
          ...c,
          id: c.phone || c._id,
          orderCount: c.orderCount || 0,
          lastOrderDate: c.lastOrderDate,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch customers:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  return { customers, loading, refetch: fetchCustomers };
}

export function useCustomerDetail(phone) {
  const [data, setData] = useState({ customer: null, orders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone) return;
    api.get(`/admin/customers/${phone}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to fetch customer:', err.message))
      .finally(() => setLoading(false));
  }, [phone]);

  return { ...data, loading };
}
