import type { Configuration } from '../types/configuration';
import type { Tool } from '../types/tools';

/**
 * Process configuration to apply defaults (e.g. enable all actions if not specified).
 */
export function processConfigurationDefaults(configuration?: Configuration): Configuration {
  if (!configuration) return {};
  return {
    ...configuration,
    context: configuration.context ?? {},
    actions: configuration.actions ?? {},
  };
}

/**
 * Check if a tool is allowed by the configuration actions.
 * If no actions are set for the tool's namespace, allow by default.
 */
export function isToolAllowed(tool: Tool, configuration: Configuration): boolean {
  const actions = configuration.actions;
  if (!actions) return true;

  for (const namespace of Object.keys(tool.actions)) {
    const perms = tool.actions[namespace];
    const configPerms = actions[namespace];
    if (!configPerms) continue;
    for (const action of Object.keys(perms)) {
      if (perms[action] && configPerms[action as keyof typeof configPerms] === false) {
        return false;
      }
    }
  }
  return true;
}
