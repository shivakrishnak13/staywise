import { API_BASE_URL } from './constants';

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts
  });
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw json;
    return json;
  } catch (err) {
    throw err;
  }
}

export const authApi = {
  signup: (body: { name: string; email: string; password: string }) => request('/user/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) => request('/user/auth', { method: 'POST', body: JSON.stringify(body) })
};

export const propertiesApi = {
  list: () => request('/properties')
};

export const bookingsApi = {
  list: (token?: string) =>
    request('/bookings', { method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {} }),
  create: (token: string, body: { propertyId: string; startDate: string; endDate: string }) =>
    request('/bookings', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }),
  cancel: (token: string, bookingId: string) =>
    request(`/bookings/${bookingId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
};
