// ====================================================================
// MediKiosk Frontend — API Client (Configured for localhost:8081)
// ====================================================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

// Token Management
export function getAccessToken() {
  return localStorage.getItem('medikiosk_token') || '';
}

export function setSession(sessionData) {
  if (sessionData?.accessToken) {
    localStorage.setItem('medikiosk_token', sessionData.accessToken);
  }
  if (sessionData?.refreshToken) {
    localStorage.setItem('medikiosk_refresh_token', sessionData.refreshToken);
  }
  localStorage.setItem('medikiosk_user', JSON.stringify(sessionData));
}

export function clearSession() {
  localStorage.removeItem('medikiosk_token');
  localStorage.removeItem('medikiosk_refresh_token');
  localStorage.removeItem('medikiosk_user');
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('medikiosk_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Universal Fetch Wrapper
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `HTTP error ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    // If backend is unreachable, throw informative error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const offlineErr = new Error('Cannot connect to Spring backend on http://localhost:8081. Ensure backend is running.');
      offlineErr.status = 503;
      throw offlineErr;
    }
    throw error;
  }
}

// ====================================================================
// API Services
// ====================================================================

export const authApi = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  logout: () => request('/auth/logout', {
    method: 'POST'
  }),

  me: () => request('/auth/me'),

  refresh: (refreshToken) => request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  }),

  changePassword: (data) => request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  forgotPassword: (email) => request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  })
};

export const adminApi = {
  getDoctors: ({ q = '', page = 0, size = 20 } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (q) params.append('q', q);
    return request(`/admin/doctors?${params.toString()}`);
  },

  getDoctorById: (doctorId) => request(`/admin/doctors/${doctorId}`),

  createDoctor: (doctorData) => request('/admin/doctors', {
    method: 'POST',
    body: JSON.stringify(doctorData)
  }),

  updateDoctor: (doctorId, doctorData) => request(`/admin/doctors/${doctorId}`, {
    method: 'PUT',
    body: JSON.stringify(doctorData)
  }),

  updateDoctorStatus: (doctorId, status) => request(`/admin/doctors/${doctorId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  getPasswordResetRequests: ({ page = 0, size = 20 } = {}) => {
    return request(`/admin/password-reset-requests?page=${page}&size=${size}`);
  },

  approveResetRequest: (requestId) => request(`/admin/password-reset-requests/${requestId}/approve`, {
    method: 'PATCH'
  }),

  rejectResetRequest: (requestId, reason) => request(`/admin/password-reset-requests/${requestId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason })
  })
};

export const doctorApi = {
  getProfile: () => request('/doctor/profile'),

  updateProfile: (data) => request('/doctor/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  requestPasswordReset: () => request('/doctor/password-reset-requests', {
    method: 'POST'
  }),

  getOwnResetRequests: ({ page = 0, size = 10 } = {}) => {
    return request(`/doctor/password-reset-requests?page=${page}&size=${size}`);
  },

  completeResetPassword: ({ token, newPassword }) => request('/doctor/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword })
  }),

  searchPatientByEmail: (email) => request(`/doctor/patients/search?email=${encodeURIComponent(email.trim())}`)
};
