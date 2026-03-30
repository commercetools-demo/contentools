import type {
  CreatePuckContentInput,
  PuckContentListResponse,
  PuckContentResponse,
  PuckContentWithStatesResponse,
  UpdatePuckContentInput,
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
// List contents (optional contentType filter)
// ---------------------------------------------------------------------------

export const listPuckContentsApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  contentType?: string
): Promise<PuckContentListResponse> => {
  const url = new URL(`${baseURL}/service/${businessUnitKey}/puck-contents`);
  if (contentType) url.searchParams.set('contentType', contentType);
  const res = await fetch(url.toString(), { headers: readHeaders(projectKey) });
  return handleResponse<PuckContentListResponse>(res);
};

// ---------------------------------------------------------------------------
// Get single content item (with states)
// ---------------------------------------------------------------------------

export const getPuckContentApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckContentWithStatesResponse> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/puck-contents/${key}`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckContentWithStatesResponse>(res);
};

// ---------------------------------------------------------------------------
// Create content item
// ---------------------------------------------------------------------------

export const createPuckContentApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  input: CreatePuckContentInput
): Promise<PuckContentResponse> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/puck-contents`,
    {
      method: 'POST',
      headers: writeHeaders(projectKey, jwtToken),
      body: JSON.stringify({ value: input }),
    }
  );
  return handleResponse<PuckContentResponse>(res);
};

// ---------------------------------------------------------------------------
// Update content item (auto-saves draft + version)
// ---------------------------------------------------------------------------

export const updatePuckContentApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  key: string,
  input: UpdatePuckContentInput
): Promise<PuckContentResponse> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/puck-contents/${key}`,
    {
      method: 'PUT',
      headers: writeHeaders(projectKey, jwtToken),
      body: JSON.stringify({ value: input }),
    }
  );
  return handleResponse<PuckContentResponse>(res);
};

// ---------------------------------------------------------------------------
// Delete content item
// ---------------------------------------------------------------------------

export const deletePuckContentApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  key: string
): Promise<void> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/puck-contents/${key}`,
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
// Get published content item
// ---------------------------------------------------------------------------

export const getPublishedPuckContentApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckContentResponse['value']> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/published/puck-contents/${key}`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckContentResponse['value']>(res);
};

// ---------------------------------------------------------------------------
// Get preview (draft || published) content item
// ---------------------------------------------------------------------------

export const getPreviewPuckContentApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckContentResponse['value']> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/preview/puck-contents/${key}`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckContentResponse['value']>(res);
};

// ---------------------------------------------------------------------------
// Query content item by contentType
// ---------------------------------------------------------------------------

export const queryPuckContentApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  contentType: string,
  mode: 'published' | 'preview'
): Promise<PuckContentResponse['value'] | null> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/${mode}/puck-contents/query`,
    {
      method: 'POST',
      headers: readHeaders(projectKey),
      body: JSON.stringify({ query: `contentType = "${contentType}"` }),
    }
  );
  if (res.status === 404) return null;
  return handleResponse<PuckContentResponse['value']>(res);
};
