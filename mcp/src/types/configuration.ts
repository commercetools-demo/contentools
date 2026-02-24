import type { Context } from './auth';

export type Permission = 'create' | 'update' | 'read';

export type Actions = {
  [namespace: string]: {
    [K in Permission]?: boolean;
  } | undefined;
};

/**
 * Configuration for the Content Tools agent.
 * context: defaults/overrides for projectKey, businessUnitKey, jwtToken.
 * actions: which tools are enabled per namespace (e.g. configuration: { read: true, create: true }).
 */
export type Configuration = {
  context?: Context;
  actions?: Actions;
};
