import { z } from 'zod';
import type { Tool } from '../../types/tools';

const key = z.string().describe('Datasource key');
const value = z.record(z.unknown()).describe('Datasource value');
const params = z.record(z.unknown()).optional().describe('Parameters for testing the datasource');

const datasourceTools: Tool[] = [
  {
    method: 'list_datasources',
    name: 'List Datasources',
    description: 'Get all datasources for the project.',
    parameters: z.object({}),
    actions: { datasource: { read: true } },
  },
  {
    method: 'get_datasource',
    name: 'Get Datasource',
    description: 'Get a datasource by key.',
    parameters: z.object({ key }),
    actions: { datasource: { read: true } },
  },
  {
    method: 'create_datasource',
    name: 'Create Datasource',
    description: 'Create a new datasource.',
    parameters: z.object({ key, value }),
    actions: { datasource: { create: true } },
  },
  {
    method: 'update_datasource',
    name: 'Update Datasource',
    description: 'Update a datasource by key.',
    parameters: z.object({ key, value }),
    actions: { datasource: { update: true } },
  },
  {
    method: 'delete_datasource',
    name: 'Delete Datasource',
    description: 'Delete a datasource by key.',
    parameters: z.object({ key }),
    actions: { datasource: { update: true } },
  },
  {
    method: 'test_datasource',
    name: 'Test Datasource',
    description: 'Test a datasource with optional params.',
    parameters: z.object({ key, params }),
    actions: { datasource: { read: true } },
  },
];

export function contextToDatasourceTools(): Tool[] {
  return datasourceTools;
}
