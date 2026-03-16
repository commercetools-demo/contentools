import type { CategoryListingConfiguration } from './category-listing';
import type { FrontendFacetConfiguration } from './facet-configuration';
import type { FooterConfiguration } from './footer-configuration';
import type { HeaderConfiguration } from './header';
import type { ThemeTokens } from './theme-tokens';

// ---------------------------------------------------------------------------
// Site metadata (SEO) — optional override from Contentful
// ---------------------------------------------------------------------------

export interface SiteMetadata {
  title: string;
  description?: string;
  openGraphImageUrl?: string;
}

// ---------------------------------------------------------------------------
// B2B account menu links (My Account dropdown: Dashboard, Orders, etc.)
// ---------------------------------------------------------------------------

export interface B2BAccountMenuLink {
  label: string;
  href: string;
}

// ---------------------------------------------------------------------------
// Frontend configuration from Contentools /configuration (facet, header, theme)
// ---------------------------------------------------------------------------

export interface FrontendConfiguration {
  facetConfiguration: FrontendFacetConfiguration;
  header: HeaderConfiguration;
  theme: ThemeTokens;
  contentoolsBaseUrl: string;
  footer?: FooterConfiguration;
  siteMetadata?: SiteMetadata;
  categoryListing?: CategoryListingConfiguration;
  /** Per-locale translation overrides (merged over base message files). */
  translations?: Record<string, Record<string, unknown>>;
  /** B2B: links shown in the My Account dropdown (e.g. Dashboard, Orders, Quotes). */
  b2bAccountMenuLinks?: B2BAccountMenuLink[];
}
