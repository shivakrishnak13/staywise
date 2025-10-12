export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const TOKEN_KEY = 'staywise_token';
export const USER_KEY = 'staywise_user';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROPERTIES: '/properties',
  PROPERTY_DETAILS: (id: string) => `/properties/${id}`,
  BOOKINGS: '/bookings',
} as const;

export const COLORS = {
  primary: '#2563eb',
  secondary: '#f59e0b',
  background: '#f9fafb',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  cardBg: '#ffffff',
  error: '#dc2626'
};
