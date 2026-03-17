import type { TenantType } from './enums';

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
  colorShadowLight?: string;
  colorShadowDark?: string;
  colorSurfaceGlass?: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  borderWidth: '0' | '1' | '2';
  borderStyle?: 'solid' | 'dashed' | 'double';
  fontFamily: string;
  fontHeading: string;
  fontWeightBase?: '300' | '400' | '500';
  fontWeightHeading?: '400' | '500' | '700' | '900';
  letterSpacing?: 'tight' | 'normal' | 'wide' | 'wider';
  textTransform?: 'none' | 'uppercase';
  spacingScale: number;
  buttonStyle: 'solid' | 'outline' | 'ghost';
  cardShadow: 'none' | 'sm' | 'md' | 'lg';
  headerStyle: 'transparent' | 'solid' | 'minimal';
  shadowStyle?: 'none' | 'soft' | 'hard-offset' | 'neumorphic' | 'clay' | 'glow';
  surfaceBlur?: 'none' | 'sm' | 'md' | 'lg';
  surfaceOpacity?: number;
  backgroundStyle?: 'solid' | 'gradient' | 'noise';
}

// ---------------------------------------------------------------------------
// Header & Navigation
// ---------------------------------------------------------------------------

/** CMS image asset for nav items, logo, and promotional content. */
export interface CmsImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Controls which header "mode" is rendered.
 * - 'full': complete header with navigation, search, actions
 * - 'minimal': stripped-down header (e.g., checkout, auth pages)
 * - 'custom': tenant/page-specific override
 */
export type HeaderVariant = 'full' | 'minimal' | 'custom';

/**
 * Defines which UI elements are visible in each variant.
 * Allows CMS editors to toggle features per page type.
 */
export interface HeaderVisibility {
  showNavigation: boolean;
  showSearch: boolean;
  showCart: boolean;
  showAccount: boolean;
  showWishlist: boolean;
  showLanguageSwitcher: boolean;
  /** B2B-specific: company switcher, quick order, etc. */
  showCompanySwitcher?: boolean;
  showQuickOrder?: boolean;
}

/**
 * Maps variants to their visibility rules.
 * CMS provides defaults; pages can override by selecting a variant.
 */
export type HeaderVariantMap = Record<HeaderVariant, HeaderVisibility>;

/** A simple link in the top-level navigation. No dropdown, no mega menu. */
export interface NavItemLink {
  type: 'link';
  label: string;
  href: string;
  /** Open in new tab */
  openInNewWindow?: boolean;
  icon?: CmsImage;
}

export interface NavMenuChildItem {
  label: string;
  href: string;
  description?: string;
  icon?: CmsImage;
  badge?: string;
}

export interface NavMenuColumn {
  heading?: string;
  items: NavMenuChildItem[];
}

/** A top-level item that opens a custom dropdown menu (NOT mega menu). */
export interface NavItemMenu {
  type: 'menu';
  label: string;
  /** Optional: clicking the label itself navigates somewhere */
  href?: string;
  columns: NavMenuColumn[];
  icon?: CmsImage;
}

export interface MegaMenuPromo {
  image: CmsImage;
  title: string;
  href: string;
  subtitle?: string;
}

/**
 * A top-level item whose mega menu is populated by commercetools categories.
 * The CMS selects WHICH category tree root(s) to display; the frontend
 * fetches the actual category data from commercetools and merges it at runtime.
 */
export interface NavItemCategoryMegaMenu {
  type: 'category-mega-menu';
  label: string;
  href?: string;
  /**
   * commercetools category IDs or keys that serve as roots for this mega menu.
   * The frontend resolves the full subtree.
   */
  categoryRoots: string[];
  /** Max depth of category tree to display (default: 3) */
  maxDepth?: number;
  /** Optional promotional content alongside categories */
  promotionalBanners?: MegaMenuPromo[];
  icon?: CmsImage;
}

/** Union of all possible top-level navigation items */
export type NavigationItem =
  | NavItemLink
  | NavItemMenu
  | NavItemCategoryMegaMenu;

export interface UtilityBarItem {
  label: string;
  href?: string;
  icon?: CmsImage;
  /** Show only for specific tenant types */
  visibleFor?: TenantType[];
}

export interface UtilityBarConfiguration {
  enabled: boolean;
  items: UtilityBarItem[];
}

/**
 * Per-tenant overrides. If a tenant needs a completely different
 * header shape, they override at this level.
 */
export interface TenantHeaderOverrides {
  /** Override the default variant map */
  variantMap?: Partial<HeaderVariantMap>;
  /** When provided, replaces the base navigation for this tenant. */
  navigation?: NavigationItem[];
  /** Override utility bar */
  utilityBar?: Partial<UtilityBarConfiguration>;
  /** Additional visibility flags */
  visibility?: Partial<HeaderVisibility>;
}

/**
 * Slots in the main header row (left to right).
 * Order is controlled by mainRowOrder in header config.
 */
export type HeaderMainRowSlot = 'logo' | 'navigation' | 'search' | 'utility';

export interface HeaderConfiguration {
  /**
   * Which variant each page/route uses.
   * Falls back to defaultVariant if no pattern matches.
   */
  defaultVariant: HeaderVariant;
  /**
   * Route pattern → variant (e.g. '/checkout/*' → 'minimal').
   * Matching order is implementation-defined.
   */
  routeVariantOverrides?: Record<string, HeaderVariant>;

  /** Visibility presets for each variant */
  variantMap: HeaderVariantMap;

  /** The primary top-level navigation items (CMS-ordered) */
  navigation: NavigationItem[];

  /** Optional utility/secondary bar above main header */
  utilityBar?: UtilityBarConfiguration;

  /** Logo configuration */
  logo: {
    desktop: CmsImage;
    mobile?: CmsImage;
    href: string;
  };

  /**
   * Order of main header row slots (left to right).
   * Omit to use DEFAULT_HEADER_MAIN_ROW_ORDER (logo, navigation, search, utility).
   */
  mainRowOrder?: HeaderMainRowSlot[];

  /** Tenant type this config targets */
  businessModel: TenantType;

  /**
   * Tenant-specific overrides keyed by tenant ID.
   * Merged on top of the base configuration at runtime.
   */
  tenantOverrides?: Record<string, TenantHeaderOverrides>;
}
