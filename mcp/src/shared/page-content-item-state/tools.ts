import { z } from 'zod';
import type { Tool } from '../../types/tools';

const bu = z.string().optional().describe('Business unit key (default from context)');
const key = z.string().describe('Page content item key');
const value = z.record(z.unknown()).optional().describe('State value');
const clearDraft = z.boolean().optional().describe('When true, clear draft after publishing');

const pageContentItemStateTools: Tool[] = [
  {
    method: 'get_page_item_states',
    name: 'Get Page Item States',
    description: 'Get draft/published states for a page content item.',
    parameters: z.object({ businessUnitKey: bu, key }),
    actions: { page_content_item_state: { read: true } },
  },
  {
    method: 'create_page_item_published_state',
    name: 'Publish Page Item',
    description: 'Create published state for a page content item. Optionally clear draft.',
    parameters: z.object({ businessUnitKey: bu, key, value, clearDraft }),
    actions: { page_content_item_state: { update: true } },
  },
  {
    method: 'delete_page_item_draft_state',
    name: 'Delete Page Item Draft State',
    description: 'Delete draft state for a page content item (revert to published).',
    parameters: z.object({ businessUnitKey: bu, key }),
    actions: { page_content_item_state: { update: true } },
  },
];

export function contextToPageContentItemStateTools(): Tool[] {
  return pageContentItemStateTools;
}
