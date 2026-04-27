import type {
  ProductSearchFacetDistinctValue,
  ProductSearchFacetRangesValue,
  ProductSearchFacetCountValue,
  ProductSearchFacetStatsValue,
} from '@commercetools/platform-sdk';

export type FacetUIType =
  | 'checkbox'
  | 'color-picker'
  | 'size-selector'
  | 'range-slider'
  | 'toggle'
  | 'radio'
  | 'custom';

export interface FacetDisplayConfig {
  label: string;
  uiType?: FacetUIType;
  customComponent?: string;
  /** Maps enum/lenum keys to human-readable labels (pre-resolved to current locale). */
  valueLabels?: Record<string, string>;
}

/**
 * A FacetConfiguration combines a CT facet expression (sent directly to the
 * Product Search API) with FE-only display metadata.
 *
 * The discriminated union mirrors `_ProductSearchFacetExpression` from the
 * CT SDK -- converting to `ProductSearchFacetExpression[]` is a trivial
 * destructure that strips the `FacetDisplayConfig` fields.
 */
export type FacetConfiguration = FacetDisplayConfig &
  (
    | { distinct: ProductSearchFacetDistinctValue }
    | { ranges: ProductSearchFacetRangesValue }
    | { count: ProductSearchFacetCountValue }
    | { stats: ProductSearchFacetStatsValue }
  );

// ---------------------------------------------------------------------------
// Frontend Facet Configuration
// ---------------------------------------------------------------------------

export interface FrontendFacetConfiguration {
  /** When true, auto-generate facets from all searchable product-type attributes. */
  enableProductTypeAttributes: boolean;
  /** Facets shown on every product listing page. */
  genericFacets: FacetConfiguration[];
  /** Additional facets keyed by category slug (merged with genericFacets for matching routes). */
  routeSpecificFacets: Record<string, FacetConfiguration[]>;
}
