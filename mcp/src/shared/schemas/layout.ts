import { z } from 'zod';

/**
 * Grid cell. Matches layout-types GridCell.
 */
export const gridCellSchema = z.object({
  id: z.string(),
  contentItemKey: z.string().nullable(),
  colSpan: z.number(),
});

/**
 * Grid row. Matches layout-types GridRow.
 */
export const gridRowSchema = z.object({
  id: z.string(),
  cells: z.array(gridCellSchema),
});

/**
 * Page layout. Matches layout-types Layout.
 */
export const layoutSchema = z.object({
  rows: z.array(gridRowSchema),
});
