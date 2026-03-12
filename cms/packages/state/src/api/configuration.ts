import {
  ThemeTokens,
  HeaderConfiguration,
  FrontendFacetConfiguration,
  FooterConfiguration,
  CategoryListingConfiguration,
  SiteMetadata,
} from '@commercetools-demo/contentools-types';

/** Full frontend configuration; each slice may be null if not stored. */
export interface AllConfigurationsResponse {
  theme: ThemeTokens | null;
  header: HeaderConfiguration | null;
  facetConfiguration: FrontendFacetConfiguration | null;
  footer: FooterConfiguration | null;
  siteMetadata: SiteMetadata | null;
  categoryListing: CategoryListingConfiguration | null;
  translations: Record<string, Record<string, unknown>> | null;
  contentoolsBaseUrl: string | null;
}

/**
 * Fetch all configurations in one request (GET .../configurations).
 */
export async function fetchAllConfigurationsEndpoint(
  baseURL: string,
  projectKey: string
): Promise<AllConfigurationsResponse> {
  const response = await fetch(`${baseURL}/configurations`, {
    headers: {
      'x-project-key': projectKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return {
    theme: data.theme ?? null,
    header: data.header ?? null,
    facetConfiguration: data.facetConfiguration ?? null,
    footer: data.footer ?? null,
    siteMetadata: data.siteMetadata ?? null,
    categoryListing: data.categoryListing ?? null,
    translations: data.translations ?? null,
    contentoolsBaseUrl: data.contentoolsBaseUrl ?? null,
  };
}

/**
 * Fetch theme configuration (GET). Returns null when no theme is stored.
 */
export async function fetchThemeEndpoint(
  baseURL: string,
  projectKey: string
): Promise<ThemeTokens | null> {
  const response = await fetch(`${baseURL}/configuration/theme`, {
    headers: {
      'x-project-key': projectKey,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data === null || data === undefined ? null : (data as ThemeTokens);
}

/**
 * Create theme configuration (POST).
 */
export async function createThemeEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: ThemeTokens
): Promise<ThemeTokens> {
  const response = await fetch(`${baseURL}/configuration/theme`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data as ThemeTokens;
}

/**
 * Update theme configuration (PUT).
 */
export async function updateThemeEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: ThemeTokens
): Promise<ThemeTokens> {
  const response = await fetch(`${baseURL}/configuration/theme`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data as ThemeTokens;
}

/**
 * Delete theme configuration (DELETE).
 */
export async function deleteThemeEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<void> {
  const response = await fetch(`${baseURL}/configuration/theme`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
}

/**
 * Fetch header configuration (GET). Returns null when no header is stored.
 */
export async function fetchHeaderEndpoint(
  baseURL: string,
  projectKey: string
): Promise<HeaderConfiguration | null> {
  const response = await fetch(`${baseURL}/configuration/header`, {
    headers: {
      'x-project-key': projectKey,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data === null || data === undefined
    ? null
    : (data as HeaderConfiguration);
}

/**
 * Create header configuration (POST).
 */
export async function createHeaderEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: HeaderConfiguration
): Promise<HeaderConfiguration> {
  const response = await fetch(`${baseURL}/configuration/header`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data as HeaderConfiguration;
}

/**
 * Update header configuration (PUT).
 */
export async function updateHeaderEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: HeaderConfiguration
): Promise<HeaderConfiguration> {
  const response = await fetch(`${baseURL}/configuration/header`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data as HeaderConfiguration;
}

/**
 * Delete header configuration (DELETE).
 */
export async function deleteHeaderEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<void> {
  const response = await fetch(`${baseURL}/configuration/header`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
}

// ---------------------------------------------------------------------------
// Facet configuration
// ---------------------------------------------------------------------------

export async function fetchFacetEndpoint(
  baseURL: string,
  projectKey: string
): Promise<FrontendFacetConfiguration | null> {
  const response = await fetch(`${baseURL}/configuration/facet`, {
    headers: { 'x-project-key': projectKey },
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data === null || data === undefined
    ? null
    : (data as FrontendFacetConfiguration);
}

export async function createFacetEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: FrontendFacetConfiguration
): Promise<FrontendFacetConfiguration> {
  const response = await fetch(`${baseURL}/configuration/facet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as FrontendFacetConfiguration;
}

export async function updateFacetEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: FrontendFacetConfiguration
): Promise<FrontendFacetConfiguration> {
  const response = await fetch(`${baseURL}/configuration/facet`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as FrontendFacetConfiguration;
}

export async function deleteFacetEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<void> {
  const response = await fetch(`${baseURL}/configuration/facet`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
}

// ---------------------------------------------------------------------------
// Footer configuration
// ---------------------------------------------------------------------------

export async function fetchFooterEndpoint(
  baseURL: string,
  projectKey: string
): Promise<FooterConfiguration | null> {
  const response = await fetch(`${baseURL}/configuration/footer`, {
    headers: { 'x-project-key': projectKey },
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data === null || data === undefined
    ? null
    : (data as FooterConfiguration);
}

export async function createFooterEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: FooterConfiguration
): Promise<FooterConfiguration> {
  const response = await fetch(`${baseURL}/configuration/footer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as FooterConfiguration;
}

export async function updateFooterEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: FooterConfiguration
): Promise<FooterConfiguration> {
  const response = await fetch(`${baseURL}/configuration/footer`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as FooterConfiguration;
}

export async function deleteFooterEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<void> {
  const response = await fetch(`${baseURL}/configuration/footer`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
}

// ---------------------------------------------------------------------------
// Site metadata configuration
// ---------------------------------------------------------------------------

export async function fetchSiteMetadataEndpoint(
  baseURL: string,
  projectKey: string
): Promise<SiteMetadata | null> {
  const response = await fetch(`${baseURL}/configuration/site-metadata`, {
    headers: { 'x-project-key': projectKey },
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data === null || data === undefined ? null : (data as SiteMetadata);
}

export async function createSiteMetadataEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: SiteMetadata
): Promise<SiteMetadata> {
  const response = await fetch(`${baseURL}/configuration/site-metadata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as SiteMetadata;
}

export async function updateSiteMetadataEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: SiteMetadata
): Promise<SiteMetadata> {
  const response = await fetch(`${baseURL}/configuration/site-metadata`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as SiteMetadata;
}

export async function deleteSiteMetadataEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<void> {
  const response = await fetch(`${baseURL}/configuration/site-metadata`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
}

// ---------------------------------------------------------------------------
// Category listing configuration
// ---------------------------------------------------------------------------

export async function fetchCategoryListingEndpoint(
  baseURL: string,
  projectKey: string
): Promise<CategoryListingConfiguration | null> {
  const response = await fetch(`${baseURL}/configuration/category-listing`, {
    headers: { 'x-project-key': projectKey },
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data === null || data === undefined
    ? null
    : (data as CategoryListingConfiguration);
}

export async function createCategoryListingEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: CategoryListingConfiguration
): Promise<CategoryListingConfiguration> {
  const response = await fetch(`${baseURL}/configuration/category-listing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as CategoryListingConfiguration;
}

export async function updateCategoryListingEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: CategoryListingConfiguration
): Promise<CategoryListingConfiguration> {
  const response = await fetch(`${baseURL}/configuration/category-listing`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as CategoryListingConfiguration;
}

export async function deleteCategoryListingEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<void> {
  const response = await fetch(`${baseURL}/configuration/category-listing`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
}

// ---------------------------------------------------------------------------
// Translations configuration
// ---------------------------------------------------------------------------

export async function fetchTranslationsEndpoint(
  baseURL: string,
  projectKey: string
): Promise<Record<string, Record<string, unknown>> | null> {
  const response = await fetch(`${baseURL}/configuration/translations`, {
    headers: { 'x-project-key': projectKey },
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data === null || data === undefined
    ? null
    : (data as Record<string, Record<string, unknown>>);
}

export async function createTranslationsEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: Record<string, Record<string, unknown>>
): Promise<Record<string, Record<string, unknown>>> {
  const response = await fetch(`${baseURL}/configuration/translations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as Record<string, Record<string, unknown>>;
}

export async function updateTranslationsEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined,
  value: Record<string, Record<string, unknown>>
): Promise<Record<string, Record<string, unknown>>> {
  const response = await fetch(`${baseURL}/configuration/translations`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ value }),
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  return (await response.json()) as Record<string, Record<string, unknown>>;
}

export async function deleteTranslationsEndpoint(
  baseURL: string,
  projectKey: string,
  jwtToken: string | undefined
): Promise<void> {
  const response = await fetch(`${baseURL}/configuration/translations`, {
    method: 'DELETE',
    headers: {
      'x-project-key': projectKey,
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  if (!response.ok)
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
}
