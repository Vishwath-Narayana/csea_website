export const API_ORIGIN = process.env.E2E_API_ORIGIN ?? 'http://localhost:3001';
export const ADMIN_BASE_URL = process.env.E2E_ADMIN_BASE_URL ?? 'http://localhost:5173';
export const PUBLIC_WEB_BASE_URL = process.env.E2E_PUBLIC_WEB_BASE_URL ?? 'http://localhost:4321';

export const API_BASE_URL = `${API_ORIGIN}/api/v1`;
export const API_HEALTH_URL = `${API_BASE_URL}/health`;

export const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/csea';

export const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL ?? 'admin@csea.kitsw.ac.in';

export const SUPER_ADMIN_PASSWORD =
  process.env.SUPER_ADMIN_PASSWORD ?? 'Password123';
