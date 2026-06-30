import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { PuckApiProvider, usePuckContentType } from '@commercetools-demo/puck-api';
import type { ImportResult } from '@commercetools-demo/puck-types';
import { Button, Card, Stack, Text } from '@commercetools/nimbus';
import { EnsureNimbusProvider } from '../EnsureNimbusProvider';

interface InnerProps {
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

export interface ImportContentTypesProps extends InnerProps {
  baseURL: string;
  projectKey: string;
  businessUnitKey: string;
  jwtToken: string;
}

const ImportContentTypesInner: React.FC<InnerProps> = ({ backButton }) => {
  const history = useHistory();
  const { importDefaultContentTypes, loading, error, clearError } =
    usePuckContentType();
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleBack = useCallback(() => {
    if (backButton?.onClick) {
      backButton.onClick();
    } else {
      history.push('/');
    }
  }, [backButton, history]);

  const handleImport = useCallback(async () => {
    clearError();
    setResult(null);
    try {
      const importResult = await importDefaultContentTypes();
      setResult(importResult);
    } catch {
      // Error is set by the hook
    }
  }, [importDefaultContentTypes, clearError]);

  return (
    <Stack direction="column" gap="600">
      {backButton && (
        <Button variant="ghost" onPress={handleBack}>
          {backButton.icon}
          {backButton.label}
        </Button>
      )}
      <Text as="h1" fontSize="2xl" fontWeight="700">Import default content types</Text>
      <Text color="neutral.11">
        Import default content type definitions from samples. Existing content
        types with the same key may be skipped or cause errors.
      </Text>

      {error && (
        <Card.Root variant="outlined">
          <Card.Body>
            <Stack direction="column" gap="400">
              <Text as="h2" fontSize="xl" fontWeight="700">Error</Text>
              <Text color="critical.11">{error}</Text>
            </Stack>
          </Card.Body>
        </Card.Root>
      )}

      <Stack direction="row" gap="400" justifyContent="center">
        <Button variant="solid" onPress={handleImport} isDisabled={loading}>
          {loading ? 'Importing…' : 'Import default content types'}
        </Button>
      </Stack>
      {result && (
        <Card.Root variant="outlined">
          <Card.Body>
            <Stack direction="column" gap="400">
              <Text as="h2" fontSize="xl" fontWeight="700">Result</Text>
              <Text>
                Imported: {result.imported.length} content type
                {result.imported.length !== 1 ? 's' : ''}.
              </Text>
              {result.imported.length > 0 && (
                <Text color="neutral.11">
                  {result.imported.join(', ')}
                </Text>
              )}
              {result.failed.length > 0 && (
                <>
                  <Text color="critical.11">
                    Failed: {result.failed.length} content type
                    {result.failed.length !== 1 ? 's' : ''}.
                  </Text>
                  <Stack direction="column" gap="200">
                    {result.failed.map(({ key, error: err }) => (
                      <Text key={key} color="critical.11">
                        {key}: {err}
                      </Text>
                    ))}
                  </Stack>
                </>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
};

const ImportContentTypes: React.FC<ImportContentTypesProps> = ({
  baseURL,
  projectKey,
  businessUnitKey,
  jwtToken,
  ...innerProps
}) => (
  <PuckApiProvider
    baseURL={baseURL}
    projectKey={projectKey}
    businessUnitKey={businessUnitKey}
    jwtToken={jwtToken}
  >
    <EnsureNimbusProvider>
      <ImportContentTypesInner {...innerProps} />
    </EnsureNimbusProvider>
  </PuckApiProvider>
);

export default ImportContentTypes;
