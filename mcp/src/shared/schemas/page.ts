import { z } from 'zod';
import { contentItemSchema } from './content-item';
import { layoutSchema } from './layout';

/**
 * Full page. Matches @commercetools-demo/contentools-types Page
 * and state api/page.ts updatePageApi value.
 */
export const pageSchema = z.object({
  key: z.string(),
  name: z.string(),
  route: z.string(),
  layout: layoutSchema,
  components: z.array(contentItemSchema),
});

/**
 * Page draft for create (no key, layout, components). Matches createPageApi payload.
 */
export const pageCreateSchema = z.object({
  name: z.string(),
  route: z.string(),
});

export type PageInput = z.infer<typeof pageSchema>;
export type PageCreateInput = z.infer<typeof pageCreateSchema>;
