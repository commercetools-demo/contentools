import { useState } from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Card from '@commercetools-uikit/card';
import { useCreateApiClient } from '../hooks/use-create-api-client';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useContentoolsApi } from '../hooks/use-contentools-api';
import { useAuth } from '../contexts/auth';
import { useSharedCredentialsSetter } from '../hooks/use-shared-custom-object-storage';
import styled from 'styled-components';

const StyledDiv = styled.div`
  padding: 16px;
`;

const ConnectProject = () => {
  const applicationContext = useApplicationContext();
  const { project, environment } = applicationContext;

  const { createApiClient, loading: creatingApiClient } = useCreateApiClient(
    project?.key ?? ''
  );
  const { authenticateProject } = useContentoolsApi();
  const { setJwtToken } = useAuth();
  const { setCredentials } = useSharedCredentialsSetter();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiClientError, setApiClientError] = useState<string>('');
  const [apiClientResult, setApiClientResult] = useState<{
    clientId: string;
    clientSecret: string;
    name: string;
    scope: string;
  } | null>(null);

  const handleCreateApiClient = async () => {
    try {
      setApiClientError('');
      const result = await createApiClient();
      setApiClientResult(result);
    } catch (err) {
      setApiClientError(
        err instanceof Error ? err.message : 'Failed to create API client'
      );
    }
  };

  const handleConnect = async () => {
    if (!apiClientResult) {
      setError('API client must be created first');
      return;
    }

    if (!project?.key) {
      setError('Project key is required');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const response = await authenticateProject({
        ct_client_id: apiClientResult.clientId,
        ct_client_secret: apiClientResult.clientSecret,
        ct_project_key: project.key,
        ct_scope: apiClientResult.scope,
        ct_region: (environment as { location?: string })?.location ?? '',
      });

      await setCredentials({
        clientId: apiClientResult.clientId,
        clientSecret: apiClientResult.clientSecret,
      });

      await setJwtToken(response.token);

      setSuccess(true);
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect project'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDiv>
      <Spacings.Stack scale="xl">
        <Text.Headline as="h1">Configuration Wizard</Text.Headline>
        <Text.Body>Connect your project to Contentools</Text.Body>

        <Card theme="light" type="raised">
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h4">
              Create an API client for connection
            </Text.Subheadline>

            {!apiClientResult ? (
              <Spacings.Stack scale="s">
                <Text.Body>
                  Create a new API client to use for connecting your project.
                </Text.Body>
                <Spacings.Inline scale="s" justifyContent="flex-start">
                  <SecondaryButton
                    label="Create API Client"
                    onClick={handleCreateApiClient}
                    iconRight={
                      creatingApiClient ? <LoadingSpinner /> : undefined
                    }
                    isDisabled={creatingApiClient}
                  />
                </Spacings.Inline>
              </Spacings.Stack>
            ) : (
              <Spacings.Stack scale="s">
                <Text.Body tone="positive">
                  API Client created successfully!
                </Text.Body>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Client ID:</strong> {apiClientResult.clientId}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Client Secret:</strong> ••••••••••••••••
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Name:</strong> {apiClientResult.name}
                  </div>
                  <div>
                    <strong>Scope:</strong> {apiClientResult.scope}
                  </div>
                </div>
              </Spacings.Stack>
            )}

            {apiClientError && (
              <Text.Body tone="critical">{apiClientError}</Text.Body>
            )}
          </Spacings.Stack>
        </Card>

        {error && (
          <Card theme="light" type="flat">
            <Text.Body tone="critical">{error}</Text.Body>
          </Card>
        )}

        {success && (
          <Card theme="light" type="flat">
            <Text.Body tone="positive">
              Successfully connected project!
            </Text.Body>
          </Card>
        )}
        <Spacings.Inline scale="m">
          <PrimaryButton
            label="Connect"
            onClick={handleConnect}
            iconRight={loading ? <LoadingSpinner /> : undefined}
            isDisabled={loading || success || !apiClientResult}
          />
        </Spacings.Inline>
      </Spacings.Stack>
    </StyledDiv>
  );
};

ConnectProject.displayName = 'ConnectProject';

export default ConnectProject;
