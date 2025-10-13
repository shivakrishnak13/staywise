import { API_BASE_URL, TOKEN_KEY } from "./constants";

async function request(
  path: string,
  opts: RequestInit = {},
  authRequired = false
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> || {}),
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  if (token && authRequired) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...opts,
    headers,
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
  signup: (body: { name: string; email: string; password: string }) =>
    request("/user/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request("/user/auth", { method: "POST", body: JSON.stringify(body) }),
};

export const propertiesApi = {
  list: () => request("/properties", { method: "GET" }, true),
  getById: (id: string) => request(`/properties/${id}`, { method: "GET" }, true),
};

export const bookingsApi = {
  list: () => request("/bookings", { method: "GET" }, true),
  create: (body: { propertyId: string; startDate: string; endDate: string }) =>
    request("/bookings", { method: "POST", body: JSON.stringify(body) }, true),
  cancel: (bookingId: string) =>
    request(`/bookings/${bookingId}`, { method: "DELETE" }, true),
};
