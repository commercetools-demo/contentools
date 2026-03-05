import { useState, useCallback } from 'react';
import {
  ThemeTokens,
  HeaderConfiguration,
  FrontendFacetConfiguration,
  FooterConfiguration,
  CategoryListingConfiguration,
  SiteMetadata,
} from '@commercetools-demo/contentools-types';
import {
  fetchAllConfigurationsEndpoint,
  fetchThemeEndpoint,
  createThemeEndpoint,
  updateThemeEndpoint,
  deleteThemeEndpoint,
  fetchHeaderEndpoint,
  createHeaderEndpoint,
  updateHeaderEndpoint,
  deleteHeaderEndpoint,
  fetchFacetEndpoint,
  createFacetEndpoint,
  updateFacetEndpoint,
  deleteFacetEndpoint,
  fetchFooterEndpoint,
  createFooterEndpoint,
  updateFooterEndpoint,
  deleteFooterEndpoint,
  fetchSiteMetadataEndpoint,
  createSiteMetadataEndpoint,
  updateSiteMetadataEndpoint,
  deleteSiteMetadataEndpoint,
  fetchCategoryListingEndpoint,
  createCategoryListingEndpoint,
  updateCategoryListingEndpoint,
  deleteCategoryListingEndpoint,
  fetchTranslationsEndpoint,
  createTranslationsEndpoint,
  updateTranslationsEndpoint,
  deleteTranslationsEndpoint,
} from '../api/configuration';

interface ConfigurationState {
  theme: ThemeTokens | null;
  header: HeaderConfiguration | null;
  facetConfiguration: FrontendFacetConfiguration | null;
  footer: FooterConfiguration | null;
  siteMetadata: SiteMetadata | null;
  categoryListing: CategoryListingConfiguration | null;
  translations: Record<string, Record<string, unknown>> | null;
  contentoolsBaseUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigurationState = {
  theme: null,
  header: null,
  facetConfiguration: null,
  footer: null,
  siteMetadata: null,
  categoryListing: null,
  translations: null,
  contentoolsBaseUrl: null,
  loading: false,
  error: null,
};

export const useConfiguration = (projectKey: string, jwtToken?: string) => {
  const [state, setState] = useState<ConfigurationState>(initialState);

  const fetchTheme = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const theme = await fetchThemeEndpoint(baseURL, projectKey);
        setState((prev) => ({
          ...prev,
          theme,
          loading: false,
        }));
        return theme;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch theme configuration',
        }));
        throw error;
      }
    },
    [projectKey]
  );

  const createTheme = useCallback(
    async (baseURL: string, value: ThemeTokens) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const theme = await createThemeEndpoint(
          baseURL,
          projectKey,
          jwtToken,
          value
        );
        setState((prev) => ({
          ...prev,
          theme,
          loading: false,
        }));
        return theme;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create theme configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const updateTheme = useCallback(
    async (baseURL: string, value: ThemeTokens) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const theme = await updateThemeEndpoint(
          baseURL,
          projectKey,
          jwtToken,
          value
        );
        setState((prev) => ({
          ...prev,
          theme,
          loading: false,
        }));
        return theme;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to update theme configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const deleteTheme = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteThemeEndpoint(baseURL, projectKey, jwtToken);
        setState((prev) => ({
          ...prev,
          theme: null,
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to delete theme configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const saveTheme = useCallback(
    async (baseURL: string, value: ThemeTokens) => {
      if (state.theme == null) {
        return createTheme(baseURL, value);
      }
      return updateTheme(baseURL, value);
    },
    [state.theme, createTheme, updateTheme]
  );

  const fetchAllConfigurations = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const data = await fetchAllConfigurationsEndpoint(baseURL, projectKey);
        setState((prev) => ({
          ...prev,
          ...data,
          loading: false,
        }));
        return data;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch configurations',
        }));
        throw error;
      }
    },
    [projectKey]
  );

  const fetchHeader = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const header = await fetchHeaderEndpoint(baseURL, projectKey);
        setState((prev) => ({
          ...prev,
          header,
          loading: false,
        }));
        return header;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch header configuration',
        }));
        throw error;
      }
    },
    [projectKey]
  );

  const createHeader = useCallback(
    async (baseURL: string, value: HeaderConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const header = await createHeaderEndpoint(
          baseURL,
          projectKey,
          jwtToken,
          value
        );
        setState((prev) => ({
          ...prev,
          header,
          loading: false,
        }));
        return header;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create header configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const updateHeader = useCallback(
    async (baseURL: string, value: HeaderConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const header = await updateHeaderEndpoint(
          baseURL,
          projectKey,
          jwtToken,
          value
        );
        setState((prev) => ({
          ...prev,
          header,
          loading: false,
        }));
        return header;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to update header configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const deleteHeader = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteHeaderEndpoint(baseURL, projectKey, jwtToken);
        setState((prev) => ({
          ...prev,
          header: null,
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to delete header configuration',
        }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );

  const saveHeader = useCallback(
    async (baseURL: string, value: HeaderConfiguration) => {
      if (state.header == null) {
        return createHeader(baseURL, value);
      }
      return updateHeader(baseURL, value);
    },
    [state.header, createHeader, updateHeader]
  );

  // Facet
  const fetchFacet = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const facetConfiguration = await fetchFacetEndpoint(baseURL, projectKey);
        setState((prev) => ({ ...prev, facetConfiguration, loading: false }));
        return facetConfiguration;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch facet configuration',
        }));
        throw error;
      }
    },
    [projectKey]
  );
  const createFacet = useCallback(
    async (baseURL: string, value: FrontendFacetConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const facetConfiguration = await createFacetEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, facetConfiguration, loading: false }));
        return facetConfiguration;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to create facet configuration' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const updateFacet = useCallback(
    async (baseURL: string, value: FrontendFacetConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const facetConfiguration = await updateFacetEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, facetConfiguration, loading: false }));
        return facetConfiguration;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to update facet configuration' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const deleteFacet = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteFacetEndpoint(baseURL, projectKey, jwtToken);
        setState((prev) => ({ ...prev, facetConfiguration: null, loading: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to delete facet configuration' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const saveFacet = useCallback(
    async (baseURL: string, value: FrontendFacetConfiguration) => {
      if (state.facetConfiguration == null) return createFacet(baseURL, value);
      return updateFacet(baseURL, value);
    },
    [state.facetConfiguration, createFacet, updateFacet]
  );

  // Footer
  const fetchFooter = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const footer = await fetchFooterEndpoint(baseURL, projectKey);
        setState((prev) => ({ ...prev, footer, loading: false }));
        return footer;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch footer configuration' }));
        throw error;
      }
    },
    [projectKey]
  );
  const createFooter = useCallback(
    async (baseURL: string, value: FooterConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const footer = await createFooterEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, footer, loading: false }));
        return footer;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to create footer configuration' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const updateFooter = useCallback(
    async (baseURL: string, value: FooterConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const footer = await updateFooterEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, footer, loading: false }));
        return footer;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to update footer configuration' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const deleteFooter = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteFooterEndpoint(baseURL, projectKey, jwtToken);
        setState((prev) => ({ ...prev, footer: null, loading: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to delete footer configuration' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const saveFooter = useCallback(
    async (baseURL: string, value: FooterConfiguration) => {
      if (state.footer == null) return createFooter(baseURL, value);
      return updateFooter(baseURL, value);
    },
    [state.footer, createFooter, updateFooter]
  );

  // Site metadata
  const fetchSiteMetadata = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const siteMetadata = await fetchSiteMetadataEndpoint(baseURL, projectKey);
        setState((prev) => ({ ...prev, siteMetadata, loading: false }));
        return siteMetadata;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch site metadata' }));
        throw error;
      }
    },
    [projectKey]
  );
  const createSiteMetadata = useCallback(
    async (baseURL: string, value: SiteMetadata) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const siteMetadata = await createSiteMetadataEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, siteMetadata, loading: false }));
        return siteMetadata;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to create site metadata' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const updateSiteMetadata = useCallback(
    async (baseURL: string, value: SiteMetadata) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const siteMetadata = await updateSiteMetadataEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, siteMetadata, loading: false }));
        return siteMetadata;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to update site metadata' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const deleteSiteMetadata = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteSiteMetadataEndpoint(baseURL, projectKey, jwtToken);
        setState((prev) => ({ ...prev, siteMetadata: null, loading: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to delete site metadata' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const saveSiteMetadata = useCallback(
    async (baseURL: string, value: SiteMetadata) => {
      if (state.siteMetadata == null) return createSiteMetadata(baseURL, value);
      return updateSiteMetadata(baseURL, value);
    },
    [state.siteMetadata, createSiteMetadata, updateSiteMetadata]
  );

  // Category listing
  const fetchCategoryListing = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const categoryListing = await fetchCategoryListingEndpoint(baseURL, projectKey);
        setState((prev) => ({ ...prev, categoryListing, loading: false }));
        return categoryListing;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch category listing configuration' }));
        throw error;
      }
    },
    [projectKey]
  );
  const createCategoryListing = useCallback(
    async (baseURL: string, value: CategoryListingConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const categoryListing = await createCategoryListingEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, categoryListing, loading: false }));
        return categoryListing;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to create category listing configuration' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const updateCategoryListing = useCallback(
    async (baseURL: string, value: CategoryListingConfiguration) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const categoryListing = await updateCategoryListingEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, categoryListing, loading: false }));
        return categoryListing;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to update category listing configuration' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const deleteCategoryListing = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteCategoryListingEndpoint(baseURL, projectKey, jwtToken);
        setState((prev) => ({ ...prev, categoryListing: null, loading: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to delete category listing configuration' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const saveCategoryListing = useCallback(
    async (baseURL: string, value: CategoryListingConfiguration) => {
      if (state.categoryListing == null) return createCategoryListing(baseURL, value);
      return updateCategoryListing(baseURL, value);
    },
    [state.categoryListing, createCategoryListing, updateCategoryListing]
  );

  // Translations
  const fetchTranslations = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const translations = await fetchTranslationsEndpoint(baseURL, projectKey);
        setState((prev) => ({ ...prev, translations, loading: false }));
        return translations;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to fetch translations' }));
        throw error;
      }
    },
    [projectKey]
  );
  const createTranslations = useCallback(
    async (baseURL: string, value: Record<string, Record<string, unknown>>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const translations = await createTranslationsEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, translations, loading: false }));
        return translations;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to create translations' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const updateTranslations = useCallback(
    async (baseURL: string, value: Record<string, Record<string, unknown>>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const translations = await updateTranslationsEndpoint(baseURL, projectKey, jwtToken, value);
        setState((prev) => ({ ...prev, translations, loading: false }));
        return translations;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to update translations' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const deleteTranslations = useCallback(
    async (baseURL: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await deleteTranslationsEndpoint(baseURL, projectKey, jwtToken);
        setState((prev) => ({ ...prev, translations: null, loading: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error: error instanceof Error ? error.message : 'Failed to delete translations' }));
        throw error;
      }
    },
    [projectKey, jwtToken]
  );
  const saveTranslations = useCallback(
    async (baseURL: string, value: Record<string, Record<string, unknown>>) => {
      if (state.translations == null) return createTranslations(baseURL, value);
      return updateTranslations(baseURL, value);
    },
    [state.translations, createTranslations, updateTranslations]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    theme: state.theme,
    header: state.header,
    facetConfiguration: state.facetConfiguration,
    footer: state.footer,
    siteMetadata: state.siteMetadata,
    categoryListing: state.categoryListing,
    translations: state.translations,
    contentoolsBaseUrl: state.contentoolsBaseUrl,
    loading: state.loading,
    error: state.error,
    fetchTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    saveTheme,
    fetchAllConfigurations,
    fetchHeader,
    createHeader,
    updateHeader,
    deleteHeader,
    saveHeader,
    fetchFacet,
    createFacet,
    updateFacet,
    deleteFacet,
    saveFacet,
    fetchFooter,
    createFooter,
    updateFooter,
    deleteFooter,
    saveFooter,
    fetchSiteMetadata,
    createSiteMetadata,
    updateSiteMetadata,
    deleteSiteMetadata,
    saveSiteMetadata,
    fetchCategoryListing,
    createCategoryListing,
    updateCategoryListing,
    deleteCategoryListing,
    saveCategoryListing,
    fetchTranslations,
    createTranslations,
    updateTranslations,
    deleteTranslations,
    saveTranslations,
    clearError,
  };
};
