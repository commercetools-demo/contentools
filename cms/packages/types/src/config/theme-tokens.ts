// ---------------------------------------------------------------------------
// Theme Tokens — canonical shape from Contentful/backoffice
// ---------------------------------------------------------------------------

export interface ThemeTokens {
  colorPrimary: string;
  colorPrimaryHover: string;
  colorPrimaryForeground?: string;
  colorSecondary: string;
  colorSecondaryForeground?: string;
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  colorTextMuted: string;
  colorForeground?: string;
  colorMuted?: string;
  colorMutedForeground?: string;
  colorDestructive?: string;
  colorDestructiveForeground?: string;
  colorAccent?: string;
  colorAccentForeground?: string;
  colorBorder?: string;
  colorInput?: string;
  colorRing?: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  borderWidth: '0' | '1' | '2';
  fontFamily: string;
  fontHeading: string;
  spacingScale: number;
  buttonStyle: 'solid' | 'outline' | 'ghost';
  cardShadow: 'none' | 'sm' | 'md' | 'lg';
  headerStyle: 'transparent' | 'solid' | 'minimal';
}
