import { z } from 'zod';
import type { Tool } from '../../types/tools';
import { themeTokensSchema } from '../schemas';

const businessUnitKeyParam = z.string().optional().describe('Business unit key (default from context)');

const configurationTools: Tool[] = [
  {
    method: 'get_theme',
    name: 'Get Configuration Theme',
    description: 'Get the configuration theme for a business unit.',
    parameters: z.object({ businessUnitKey: businessUnitKeyParam }),
    actions: { configuration: { read: true } },
  },
  {
    method: 'create_theme',
    name: 'Create Configuration Theme',
    description: 'Create the configuration theme for a business unit.',
    parameters: z.object({ businessUnitKey: businessUnitKeyParam, value: themeTokensSchema }),
    actions: { configuration: { create: true } },
  },
  {
    method: 'update_theme',
    name: 'Update Configuration Theme',
    description: 'Update the configuration theme for a business unit.',
    parameters: z.object({ businessUnitKey: businessUnitKeyParam, value: themeTokensSchema }),
    actions: { configuration: { update: true } },
  },
  {
    method: 'delete_theme',
    name: 'Delete Configuration Theme',
    description: 'Delete the configuration theme for a business unit.',
    parameters: z.object({ businessUnitKey: businessUnitKeyParam }),
    actions: { configuration: { update: true } },
  },
];

export function contextToConfigurationTools(): Tool[] {
  return configurationTools;
}
