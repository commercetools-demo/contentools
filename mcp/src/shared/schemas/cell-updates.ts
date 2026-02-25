import { z } from 'zod';

/**
 * Cell span updates. Matches state api/page.ts updateCellSpanInPageApi updates param.
 */
export const cellSpanUpdatesSchema = z.object({
  colSpan: z.number(),
  shouldRemoveEmptyCell: z.boolean().optional(),
  shouldAddEmptyCell: z.boolean().optional(),
});

export type CellSpanUpdatesInput = z.infer<typeof cellSpanUpdatesSchema>;
