import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from service root (for local E2E) or use process.env (CI)
const serviceEnvPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: serviceEnvPath });

// --- Env variable names (keys in process.env) ---
export const ENV_KEYS = {
  BASE_URL: 'BASE_URL',
  BUSINESS_UNIT_KEY: 'BUSINESS_UNIT_KEY',
  CTP_PROJECT_KEY: 'CTP_PROJECT_KEY',
  CTP_CLIENT_ID: 'CTP_CLIENT_ID',
  CTP_CLIENT_SECRET: 'CTP_CLIENT_SECRET',
  CTP_REGION: 'CTP_REGION',
  CTP_SCOPE: 'CTP_SCOPE',
  CTP_AUTH_URL: 'CTP_AUTH_URL',
  CTP_API_URL: 'CTP_API_URL',
} as const;

// --- Default values ---
export const DEFAULT_BASE_URL = 'http://localhost:8080';
export const DEFAULT_BUSINESS_UNIT_KEY = 'e2e-bu';

// --- API path ---
export const SERVICE_PREFIX = '/service';

// --- Resolved env (values from process.env with defaults) ---
export const E2E_ENV = {
  BASE_URL: process.env[ENV_KEYS.BASE_URL] || process.env.BASE_URL || DEFAULT_BASE_URL,
  BUSINESS_UNIT_KEY:
    process.env[ENV_KEYS.BUSINESS_UNIT_KEY] ||
    process.env.BUSINESS_UNIT_KEY ||
    process.env[ENV_KEYS.CTP_PROJECT_KEY] ||
    process.env.CTP_PROJECT_KEY ||
    DEFAULT_BUSINESS_UNIT_KEY,
  CTP_PROJECT_KEY: process.env[ENV_KEYS.CTP_PROJECT_KEY] || process.env.CTP_PROJECT_KEY || '',
  CTP_CLIENT_ID: process.env[ENV_KEYS.CTP_CLIENT_ID] || process.env.CTP_CLIENT_ID || '',
  CTP_CLIENT_SECRET: process.env[ENV_KEYS.CTP_CLIENT_SECRET] || process.env.CTP_CLIENT_SECRET || '',
  CTP_REGION: process.env[ENV_KEYS.CTP_REGION] || process.env.CTP_REGION,
  CTP_SCOPE: process.env[ENV_KEYS.CTP_SCOPE] || process.env.CTP_SCOPE,
  CTP_AUTH_URL: process.env[ENV_KEYS.CTP_AUTH_URL] || process.env.CTP_AUTH_URL,
  CTP_API_URL: process.env[ENV_KEYS.CTP_API_URL] || process.env.CTP_API_URL,
};

function requireEnv(name: string, value: string): void {
  if (!value) {
    throw new Error(`E2E missing required env: ${name}`);
  }
}

export function ensureE2EEnv(): void {
  requireEnv(ENV_KEYS.BASE_URL, E2E_ENV.BASE_URL);
  requireEnv(ENV_KEYS.CTP_PROJECT_KEY, E2E_ENV.CTP_PROJECT_KEY);
  requireEnv(ENV_KEYS.CTP_CLIENT_ID, E2E_ENV.CTP_CLIENT_ID);
  requireEnv(ENV_KEYS.CTP_CLIENT_SECRET, E2E_ENV.CTP_CLIENT_SECRET);
}
