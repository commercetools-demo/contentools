import type { Field } from '@measured/puck';

/**
 * Reusable font-size control for plain-text component props (headings, labels,
 * etc.). This covers the text elements that aren't edited through the rich-text
 * editor (the Nimbus RichTextInput has no inline font-size control).
 *
 * The stored value is a CSS size string (e.g. "1.5rem"); the empty option means
 * "inherit the component default", so render with `value || defaultSize`.
 */
const FONT_SIZE_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Small (0.875rem)', value: '0.875rem' },
  { label: 'Medium (1rem)', value: '1rem' },
  { label: 'Large (1.25rem)', value: '1.25rem' },
  { label: 'X-Large (1.5rem)', value: '1.5rem' },
  { label: '2X-Large (2rem)', value: '2rem' },
  { label: '3X-Large (2.5rem)', value: '2.5rem' },
  { label: '4X-Large (3rem)', value: '3rem' },
];

export const FONT_SIZE_FIELD = (label: string): Field => ({
  type: 'select',
  label,
  options: FONT_SIZE_OPTIONS,
});
