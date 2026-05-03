import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext(null);

function loadAdmin() {
  try {
    const raw = sessionStorage.getItem('oops-admin-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(loadAdmin);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session via refresh token cookie
  useEffect(() => {
    if (api.getToken()) {
      api.get('/auth/me')
        .then((res) => {
          const user = res.data.user;
          if (user.role !== 'admin') throw new Error('Not admin');
          setAdmin({ ...user, loggedIn: true });
          sessionStorage.setItem('oops-admin-user', JSON.stringify({ ...user, loggedIn: true }));
        })
        .catch(() => {
          setAdmin(null);
          api.clearToken();
          sessionStorage.removeItem('oops-admin-user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Step 1: send email+password, server responds with requiresOtp or error
  const login = async (email, password) => {
    try {
      await api.post('/admin/auth/login', { email, password });
      return { success: true, requiresOtp: true };
    } catch (err) {
      return { error: err.message || 'Login failed' };
    }
  };

  // Step 2: verify the 2FA OTP
  const verifyOtp = async (email, otp) => {
    try {
      const res = await api.post('/admin/auth/verify-otp', { email, otp });
      const { user, accessToken } = res.data;
      api.setToken(accessToken);
      const session = { ...user, loggedIn: true };
      setAdmin(session);
      sessionStorage.setItem('oops-admin-user', JSON.stringify(session));
      return { success: true };
    } catch (err) {
      return { error: err.message || 'OTP verification failed' };
    }
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    api.clearToken();
    setAdmin(null);
    sessionStorage.removeItem('oops-admin-user');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, verifyOtp, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider');
  return ctx;
}
