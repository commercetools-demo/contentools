import { z } from 'zod';
import type { Tool } from '../../types/tools';

const keyParam = z.string().describe('Content type key');
const valueParam = z.record(z.unknown()).describe('Content type value (name, schema, renderer, etc.)');

const contentTypeTools: Tool[] = [
  {
    method: 'list_content_types',
    name: 'List Content Types',
    description: 'Get all content types for the project.',
    parameters: z.object({}),
    actions: { content_type: { read: true } },
  },
  {
    method: 'get_content_type',
    name: 'Get Content Type',
    description: 'Get a content type by key.',
    parameters: z.object({ key: keyParam }),
    actions: { content_type: { read: true } },
  },
  {
    method: 'create_content_type',
    name: 'Create Content Type',
    description: 'Create a new content type.',
    parameters: z.object({ value: valueParam }),
    actions: { content_type: { create: true } },
  },
  {
    method: 'update_content_type',
    name: 'Update Content Type',
    description: 'Update an existing content type by key.',
    parameters: z.object({ key: keyParam, value: valueParam }),
    actions: { content_type: { update: true } },
  },
  {
    method: 'delete_content_type',
    name: 'Delete Content Type',
    description: 'Delete a content type by key.',
    parameters: z.object({ key: keyParam }),
    actions: { content_type: { update: true } },
  },
];

export function contextToContentTypeTools(): Tool[] {
  return contentTypeTools;
}
