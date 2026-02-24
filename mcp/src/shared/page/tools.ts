import { z } from 'zod';
import type { Tool } from '../../types/tools';

const bu = z.string().optional().describe('Business unit key (default from context)');
const key = z.string().describe('Page key');
const value = z.record(z.unknown()).describe('Page value');
const query = z.string().describe('Query string for filtering');

const pageTools: Tool[] = [
  {
    method: 'get_pages',
    name: 'Get Pages',
    description: 'List all pages for a business unit.',
    parameters: z.object({ businessUnitKey: bu }),
    actions: { page: { read: true } },
  },
  {
    method: 'get_page',
    name: 'Get Page',
    description: 'Get a page by key (with states).',
    parameters: z.object({ businessUnitKey: bu, key }),
    actions: { page: { read: true } },
  },
  {
    method: 'create_page',
    name: 'Create Page',
    description: 'Create a new page.',
    parameters: z.object({ businessUnitKey: bu, value }),
    actions: { page: { create: true } },
  },
  {
    method: 'update_page',
    name: 'Update Page',
    description: 'Update a page by key.',
    parameters: z.object({ businessUnitKey: bu, key, value }),
    actions: { page: { update: true } },
  },
  {
    method: 'delete_page',
    name: 'Delete Page',
    description: 'Delete a page by key.',
    parameters: z.object({ businessUnitKey: bu, key }),
    actions: { page: { update: true } },
  },
  {
    method: 'query_published_pages',
    name: 'Query Published Pages',
    description: 'Query published pages with a query string.',
    parameters: z.object({ businessUnitKey: bu, query }),
    actions: { page: { read: true } },
  },
  {
    method: 'query_preview_pages',
    name: 'Query Preview Pages',
    description: 'Query preview (draft + published) pages with a query string.',
    parameters: z.object({ businessUnitKey: bu, query }),
    actions: { page: { read: true } },
  },
  {
    method: 'get_published_page',
    name: 'Get Published Page',
    description: 'Get the published version of a page by key.',
    parameters: z.object({ businessUnitKey: bu, key }),
    actions: { page: { read: true } },
  },
  {
    method: 'get_preview_page',
    name: 'Get Preview Page',
    description: 'Get the preview version of a page by key.',
    parameters: z.object({ businessUnitKey: bu, key }),
    actions: { page: { read: true } },
  },
];

export function contextToPageTools(): Tool[] {
  return pageTools;
}
