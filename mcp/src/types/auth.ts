/**
 * Authentication and context for the Content Tools API.
 * All API calls use baseUrl with x-project-key and optionally Authorization: Bearer jwtToken.
 */
export type AuthConfig = {
  baseUrl: string;
  projectKey: string;
  businessUnitKey?: string;
  jwtToken?: string;
};

/**
 * Optional overrides per request. Merged with AuthConfig so callers can set once and tools can override.
 */
export type Context = {
  projectKey?: string;
  businessUnitKey?: string;
  jwtToken?: string;
};
