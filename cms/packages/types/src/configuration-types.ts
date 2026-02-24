export interface ThemeTokens {
  colorPrimary: string;
  colorPrimaryHover: string;
  colorSecondary: string;
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  colorTextMuted: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  borderWidth: '0' | '1' | '2';
  fontFamily: string;
  fontHeading: string;
  spacingScale: number;
  buttonStyle: 'solid' | 'outline' | 'ghost';
  cardShadow: 'none' | 'sm' | 'md' | 'lg';
  headerStyle: 'transparent' | 'solid' | 'minimal';
}
