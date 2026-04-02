import type {
  CreatePuckPageInput,
  PuckPageListResponse,
  PuckPageResponse,
  PuckPageWithStatesResponse,
  UpdatePuckPageInput,
} from '@commercetools-demo/puck-types';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const readHeaders = (projectKey: string): Record<string, string> => ({
  'Content-Type': 'application/json',
  'x-project-key': projectKey,
});

const writeHeaders = (
  projectKey: string,
  jwtToken: string
): Record<string, string> => ({
  'Content-Type': 'application/json',
  'x-project-key': projectKey,
  Authorization: `Bearer ${jwtToken}`,
});

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `[puck-api] HTTP ${res.status}: ${body || res.statusText}`
    );
  }
  return res.json() as Promise<T>;
};

// ---------------------------------------------------------------------------
// List pages
// ---------------------------------------------------------------------------

export const listPuckPagesApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string
): Promise<PuckPageListResponse> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/puck-pages`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckPageListResponse>(res);
};

// ---------------------------------------------------------------------------
// Get single page (with states)
// ---------------------------------------------------------------------------

export const getPuckPageApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckPageWithStatesResponse> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/puck-pages/${key}`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckPageWithStatesResponse>(res);
};

// ---------------------------------------------------------------------------
// Create page
// ---------------------------------------------------------------------------

export const createPuckPageApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  input: CreatePuckPageInput
): Promise<PuckPageResponse> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/puck-pages`,
    {
      method: 'POST',
      headers: writeHeaders(projectKey, jwtToken),
      body: JSON.stringify({ value: input }),
    }
  );
  return handleResponse<PuckPageResponse>(res);
};

// ---------------------------------------------------------------------------
// Update page (auto-saves draft + version)
// ---------------------------------------------------------------------------

export const updatePuckPageApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  key: string,
  input: UpdatePuckPageInput
): Promise<PuckPageResponse> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/puck-pages/${key}`,
    {
      method: 'PUT',
      headers: writeHeaders(projectKey, jwtToken),
      body: JSON.stringify({ value: input }),
    }
  );
  return handleResponse<PuckPageResponse>(res);
};

// ---------------------------------------------------------------------------
// Delete page
// ---------------------------------------------------------------------------

export const deletePuckPageApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  key: string
): Promise<void> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/puck-pages/${key}`,
    {
      method: 'DELETE',
      headers: writeHeaders(projectKey, jwtToken),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[puck-api] HTTP ${res.status}: ${body || res.statusText}`);
  }
};

// ---------------------------------------------------------------------------
// Get published page
// ---------------------------------------------------------------------------

export const getPublishedPuckPageApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckPageResponse['value']> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/published/puck-pages/${key}`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckPageResponse['value']>(res);
};

// ---------------------------------------------------------------------------
// Get preview (draft || published) page
// ---------------------------------------------------------------------------

export const getPreviewPuckPageApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckPageResponse['value']> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/preview/puck-pages/${key}`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckPageResponse['value']>(res);
};

// ---------------------------------------------------------------------------
// Query page by slug
// ---------------------------------------------------------------------------

export const queryPuckPageApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  slug: string,
  mode: 'published' | 'preview'
): Promise<PuckPageResponse['value'] | null> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/${mode}/puck-pages/query`,
    {
      method: 'POST',
      headers: readHeaders(projectKey),
      body: JSON.stringify({ query: `slug = "${slug}"` }),
    }
  );
  if (res.status === 404) return null;
  return handleResponse<PuckPageResponse['value']>(res);
};
