// ---------------------------------------------------------------------------
// Datasource resolution API
// ---------------------------------------------------------------------------

export const resolveDatasourceApi = async (
  baseURL: string,
  projectKey: string,
  businessUnitKey: string,
  jwtToken: string,
  datasourceKey: string,
  params: Record<string, string>
): Promise<unknown> => {
  const res = await fetch(
    `${baseURL}/service/datasource/${datasourceKey}/test`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-project-key': projectKey,
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(params),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[puck-api] HTTP ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
};
