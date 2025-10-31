// Frontend runtime configuration. When running the web app locally, use localhost.
export const ORCHESTRATION_URL = (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_ORCHESTRATION_URL) || 'http://127.0.0.1:8000';
