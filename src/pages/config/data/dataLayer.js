import { useState, useEffect, useCallback } from 'react';
import * as settingsService from '../../../services/settingsService';

export const EMAIL_TRIGGERS = [
  { id: 'placed', status: 'placed', label: 'Order Placed', description: 'Confirmation with order summary & expected delivery', color: 'bg-blue-500', defaultOn: true },
  { id: 'processing', status: 'processing', label: 'Processing', description: 'Let customer know their order is being prepared', color: 'bg-orange-500', defaultOn: false },
  { id: 'shipped', status: 'shipped', label: 'Shipped', description: 'Shipping confirmation with tracking details', color: 'bg-violet-500', defaultOn: true },
  { id: 'out-for-delivery', status: 'out-for-delivery', label: 'Out for Delivery', description: 'Notify customer their order arrives today', color: 'bg-sky-500', defaultOn: true },
  { id: 'delivered', status: 'delivered', label: 'Delivered', description: 'Delivery confirmation with feedback link', color: 'bg-emerald-500', defaultOn: true },
];

export const CONNECTIONS = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Automated shipping & order status emails to customers.',
    color: '#EA4335',
    icon: 'gmail',
    about: 'Connect your Gmail account via Auth0 to automatically send transactional emails to customers. Once connected, OOPS will send order confirmations when an order is placed, shipping updates when the status changes, and delivery confirmations when the order arrives.',
    useCase: [
      'Order placed confirmation with order summary',
      'Shipping status update when order is shipped',
      'Out for delivery notification',
      'Delivered confirmation with feedback link',
    ],
    setupSteps: [
      'Click "Sign in with Google" below to authenticate via Auth0.',
      'Sign in with the Gmail account you want to send emails from.',
      'Grant OOPS permission to send emails on your behalf.',
      'Configure which status changes trigger customer emails.',
      'Click "Send Test Email" to verify everything works.',
    ],
    fields: [],
    note: 'Authentication is handled securely via Auth0. We never store your Google password. You can revoke access anytime from your Google account settings.',
  },
];

export function useConnections() {
  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsService.getConnections()
      .then((res) => setConnections(res.data.connections || {}))
      .catch((err) => console.error('Failed to fetch connections:', err.message))
      .finally(() => setLoading(false));
  }, []);

  const connect = useCallback(async (id, data) => {
    const payload = { ...data, connectedAt: new Date().toISOString() };
    await settingsService.saveConnection(id, payload);
    setConnections((prev) => ({ ...prev, [id]: payload }));
  }, []);

  const disconnect = useCallback(async (id) => {
    await settingsService.deleteConnection(id);
    setConnections((prev) => ({ ...prev, [id]: null }));
  }, []);

  const getConnection = useCallback((id) => connections[id], [connections]);
  const isConnected = useCallback((id) => !!connections[id], [connections]);

  return { connections, loading, connect, disconnect, getConnection, isConnected };
}

export function useEmailTriggers() {
  const [triggers, setTriggers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsService.getEmailTriggers()
      .then((res) => setTriggers(res.data.triggers || {}))
      .catch((err) => console.error('Failed to fetch triggers:', err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggle = useCallback(async (id) => {
    const next = { ...triggers, [id]: !triggers[id] };
    setTriggers(next);
    try {
      await settingsService.updateEmailTriggers(next);
    } catch (err) {
      // Revert on failure
      setTriggers(triggers);
      console.error('Failed to update trigger:', err.message);
    }
  }, [triggers]);

  const isEnabled = useCallback((statusId) => !!triggers[statusId], [triggers]);

  return { triggers, loading, toggle, isEnabled };
}

export function shouldSendEmail(status) {
  // This is now handled server-side in order.service
  // Keeping for UI indication only — check if gmail is connected and trigger is on
  return false;
}
