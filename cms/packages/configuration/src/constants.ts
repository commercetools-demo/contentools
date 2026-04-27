import {
  ThemeTokens,
  HeaderConfiguration,
  HeaderVisibility,
  HeaderMainRowSlot,
} from '@commercetools-demo/contentools-types';

/** Default order of main header row slots when mainRowOrder is not specified. */
export const DEFAULT_MAIN_ROW_ORDER: HeaderMainRowSlot[] = [
  'logo',
  'navigation',
  'search',
  'utility',
];

export const DEFAULT_THEME: ThemeTokens = {
  colorPrimary: '#0f766e',
  colorPrimaryHover: '#0d9488',
  colorSecondary: '#64748b',
  colorBackground: '#ffffff',
  colorSurface: '#f8fafc',
  colorText: '#0f172a',
  colorTextMuted: '#64748b',
  borderRadius: 'md',
  borderWidth: '1',
  fontFamily: 'system-ui, sans-serif',
  fontHeading: 'system-ui, sans-serif',
  spacingScale: 8,
  buttonStyle: 'solid',
  cardShadow: 'md',
  headerStyle: 'solid',
  colorShadowLight: '#ffffff',
  colorShadowDark: '#b8bec7',
  colorSurfaceGlass: 'rgba(255,255,255,0.18)',
  shadowStyle: 'none',
  surfaceBlur: 'none',
  surfaceOpacity: 1,
  fontWeightBase: '400',
  fontWeightHeading: '700',
  letterSpacing: 'normal',
  textTransform: 'none',
  borderStyle: 'solid',
  backgroundStyle: 'solid',
};

const defaultVisibility: HeaderVisibility = {
  showNavigation: true,
  showSearch: true,
  showCart: true,
  showAccount: true,
  showWishlist: false,
  showLanguageSwitcher: false,
};

export const DEFAULT_HEADER: HeaderConfiguration = {
  defaultVariant: 'full',
  variantMap: {
    full: { ...defaultVisibility },
    minimal: {
      showNavigation: false,
      showSearch: false,
      showCart: true,
      showAccount: true,
      showWishlist: false,
      showLanguageSwitcher: false,
    },
    custom: { ...defaultVisibility },
  },
  navigation: [],
  logo: {
    desktop: { src: '', alt: '' },
    href: '/',
  },
  businessModel: 'b2c',
  utilityBar: { enabled: false, items: [] },
  mainRowOrder: [...DEFAULT_MAIN_ROW_ORDER],
} as HeaderConfiguration;
