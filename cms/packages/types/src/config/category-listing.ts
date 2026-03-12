// ---------------------------------------------------------------------------
// Category listing configuration (from Contentful)
// ---------------------------------------------------------------------------

export interface SortAttributes {
  [key: string]: any;
}
export interface CategoryListingSortOption {
  label: string;
  value: string;
  sortAttributes: SortAttributes | undefined;
}

export interface CategoryListingConfiguration {
  sortOptions: CategoryListingSortOption[];
  pageSize?: number;
  defaultSortValue?: string;
}
