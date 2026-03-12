import { z } from 'zod';

/**
 * Content item value. Matches @commercetools-demo/contentools-types ContentItem
 * and state api/content-item.ts createContentItemEndpoint/updateContentItemEndpoint body value.
 */
export const contentItemSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  key: z.string().optional(),
  businessUnitKey: z.string().optional(),
  name: z.string(),
  properties: z.record(z.any()).default({}),
});

export type ContentItemInput = z.infer<typeof contentItemSchema>;
