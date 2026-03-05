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
}
