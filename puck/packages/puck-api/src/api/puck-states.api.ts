import type {
  PuckPageStateResponse,
  PuckPageVersionResponse,
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

export const getPuckPageStatesApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckPageStateResponse> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/puck-pages/${key}/states`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckPageStateResponse>(res);
};

// ---------------------------------------------------------------------------
// Publish (draft → published)
// ---------------------------------------------------------------------------

export const publishPuckPageApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  key: string,
  clearDraft = false
): Promise<PuckPageStateResponse> => {
  const url = new URL(
    `${baseURL}/service/${businessUnitKey}/puck-pages/${key}/states/published`
  );
  if (clearDraft) url.searchParams.set('clearDraft', 'true');

  const res = await fetch(url.toString(), {
    method: 'PUT',
    headers: writeHeaders(projectKey, jwtToken),
  });
  return handleResponse<PuckPageStateResponse>(res);
};

// ---------------------------------------------------------------------------
// Revert draft to published (delete draft state)
// ---------------------------------------------------------------------------

export const revertPuckPageDraftApi = async (
  baseURL: string,
  projectKey: string,
  jwtToken: string,
  businessUnitKey: string,
  key: string
): Promise<PuckPageStateResponse> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/puck-pages/${key}/states/draft`,
    {
      method: 'DELETE',
      headers: writeHeaders(projectKey, jwtToken),
    }
  );
  return handleResponse<PuckPageStateResponse>(res);
};

// ---------------------------------------------------------------------------
// Get version history
// ---------------------------------------------------------------------------

export const getPuckPageVersionsApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  key: string
): Promise<PuckPageVersionResponse> => {
  const res = await fetch(
    `${baseURL}/service/${businessUnitKey}/puck-pages/${key}/versions`,
    { headers: readHeaders(projectKey) }
  );
  return handleResponse<PuckPageVersionResponse>(res);
};
