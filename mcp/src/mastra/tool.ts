import { createTool } from '@mastra/core/tools';
import type { z } from 'zod';
import type ContentToolsAPI from '../shared/api';
import { formatToolOutput } from '../shared/format';

export default function ContentToolsTool(
  api: ContentToolsAPI,
  method: string,
  description: string,
  schema: z.ZodObject<z.ZodRawShape>
) {
  return createTool({
    id: method,
    description,
    inputSchema: schema,
    execute: async ({ context }) => {
      const result = await api.run(method, context as Record<string, unknown>);
      return formatToolOutput(result);
    },
  });
}
