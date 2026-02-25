import { z } from 'zod';

/**
 * Theme configuration (ThemeTokens). Matches @commercetools-demo/contentools-types ThemeTokens
 * and state api/configuration.ts createThemeEndpoint/updateThemeEndpoint value.
 */
export const themeTokensSchema = z.object({
  colorPrimary: z.string(),
  colorPrimaryHover: z.string(),
  colorSecondary: z.string(),
  colorBackground: z.string(),
  colorSurface: z.string(),
  colorText: z.string(),
  colorTextMuted: z.string(),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'full']),
  borderWidth: z.enum(['0', '1', '2']),
  fontFamily: z.string(),
  fontHeading: z.string(),
  spacingScale: z.number(),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']),
  cardShadow: z.enum(['none', 'sm', 'md', 'lg']),
  headerStyle: z.enum(['transparent', 'solid', 'minimal']),
});

export type ThemeTokensInput = z.infer<typeof themeTokensSchema>;
