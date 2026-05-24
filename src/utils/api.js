const API = '/api';
let accessToken = sessionStorage.getItem('oops-access-token');

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, options = {}) {
  const headers = { ...options.headers };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(`${API}${path}`, {
    ...options,
    headers,
    credentials: 'include', // send httpOnly cookies
  });

  // If 401 and not already retrying, try to refresh the token
  if (res.status === 401 && !options._retry) {
    const refreshed = await refresh();
    if (refreshed) {
      return request(path, { ...options, _retry: true });
    }
    accessToken = null;
    sessionStorage.removeItem('oops-access-token');
    const data = await res.json();
    throw new ApiError(data.message, 401, data.errors);
  }

  const data = await res.json();
  if (!res.ok) throw new ApiError(data.message, res.status, data.errors);
  return data;
}

async function refresh() {
  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      accessToken = null;
      sessionStorage.removeItem('oops-access-token');
      sessionStorage.removeItem('oops-admin-user');
      return false;
    }
    const data = await res.json();
    accessToken = data.data.accessToken;
    sessionStorage.setItem('oops-access-token', accessToken);
    return true;
  } catch {
    accessToken = null;
    sessionStorage.removeItem('oops-access-token');
    sessionStorage.removeItem('oops-admin-user');
    return false;
  }
}

// Convenience methods
const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (path, body) =>
    request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path, body) =>
    request(path, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    }),
  upload: (path, formData) =>
    request(path, { method: 'POST', body: formData }),

  setToken: (token) => {
    accessToken = token;
    if (token) {
      sessionStorage.setItem('oops-access-token', token);
    } else {
      sessionStorage.removeItem('oops-access-token');
    }
  },

  getToken: () => accessToken,
  clearToken: () => {
    accessToken = null;
    sessionStorage.removeItem('oops-access-token');
  },

  ApiError,
};

export default api;
