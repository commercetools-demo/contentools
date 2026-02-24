import { z } from 'zod';
import type { Tool } from '../../types/tools';

const bu = z.string().optional().describe('Business unit key (default from context)');
const key = z.string().describe('Page key');
const value = z.record(z.unknown()).optional().describe('State value');
const clearDraft = z.boolean().optional().describe('When true, clear draft after publishing');

const pageStateTools: Tool[] = [
  {
    method: 'get_page_states',
    name: 'Get Page States',
    description: 'Get draft/published states for a page.',
    parameters: z.object({ businessUnitKey: bu, key }),
    actions: { page_state: { read: true } },
  },
  {
    method: 'create_page_published_state',
    name: 'Publish Page',
    description: 'Create published state for a page. Optionally clear draft.',
    parameters: z.object({ businessUnitKey: bu, key, value, clearDraft }),
    actions: { page_state: { update: true } },
  },
  {
    method: 'delete_page_draft_state',
    name: 'Delete Page Draft State',
    description: 'Delete draft state for a page (revert to published).',
    parameters: z.object({ businessUnitKey: bu, key }),
    actions: { page_state: { update: true } },
  },
];

export function contextToPageStateTools(): Tool[] {
  return pageStateTools;
}
