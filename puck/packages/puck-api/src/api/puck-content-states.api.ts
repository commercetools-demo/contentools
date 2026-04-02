import type {
  PuckContentStateResponse,
  PuckContentVersionResponse,
} from '@commercetools-demo/puck-types';

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
    throw new Error(`[puck-api] HTTP ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
};

// ---------------------------------------------------------------------------
// Get states
// ---------------------------------------------------------------------------

export const getPuckContentStatesApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckContentStateResponse> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/puck-contents/${key}/states`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckContentStateResponse>(res);
};

// ---------------------------------------------------------------------------
// Publish (draft → published)
// ---------------------------------------------------------------------------

export const publishPuckContentApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  key: string,
  clearDraft = false
): Promise<PuckContentStateResponse> => {
  const url = new URL(
    `${baseURL}/${businessUnitKey}/puck-contents/${key}/states/published`
  );
  if (clearDraft) url.searchParams.set('clearDraft', 'true');

  const res = await fetch(url.toString(), {
    method: 'PUT',
    headers: writeHeaders(projectKey, jwtToken),
  });
  return handleResponse<PuckContentStateResponse>(res);
};

// ---------------------------------------------------------------------------
// Revert draft to published (delete draft state)
// ---------------------------------------------------------------------------

export const revertPuckContentDraftApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  key: string
): Promise<PuckContentStateResponse> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/puck-contents/${key}/states/draft`,
    {
      method: 'DELETE',
      headers: writeHeaders(projectKey, jwtToken),
    }
  );
  return handleResponse<PuckContentStateResponse>(res);
};

// ---------------------------------------------------------------------------
// Get version history
// ---------------------------------------------------------------------------

export const getPuckContentVersionsApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckContentVersionResponse> => {
  const res = await fetch(
    `${baseURL}/${businessUnitKey}/puck-contents/${key}/versions`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckContentVersionResponse>(res);
};
