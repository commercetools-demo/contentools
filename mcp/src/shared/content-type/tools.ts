import { z } from 'zod';
import type { Tool } from '../../types/tools';
import { contentTypeDataSchema } from '../schemas';

const keyParam = z.string().describe('Content type key');

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
    parameters: z.object({ value: contentTypeDataSchema }),
    actions: { content_type: { create: true } },
  },
  {
    method: 'update_content_type',
    name: 'Update Content Type',
    description: 'Update an existing content type by key.',
    parameters: z.object({ key: keyParam, value: contentTypeDataSchema }),
    actions: { content_type: { update: true } },
  },
  {
    method: 'delete_content_type',
    name: 'Delete Content Type',
    description: 'Delete a content type by key.',
    parameters: z.object({ key: keyParam }),
    actions: { content_type: { update: true } },
  },
  {
    method: 'import_content_types',
    name: 'Import Default Content Types',
    description: 'Import default content types from samples. Requires JWT.',
    parameters: z.object({}),
    actions: { content_type: { create: true } },
  },
];

export function contextToContentTypeTools(): Tool[] {
  return contentTypeTools;
}
