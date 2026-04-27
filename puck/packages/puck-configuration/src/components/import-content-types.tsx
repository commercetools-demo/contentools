import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { usePuckContentType } from '@commercetools-demo/puck-api';
import type { ImportResult } from '@commercetools-demo/puck-types';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';

interface Props {
  parentUrl?: string;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
}

const ImportContentTypes: React.FC<Props> = ({ backButton }) => {
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
    <Spacings.Stack scale="l">
      {backButton && (
        <FlatButton
          onClick={handleBack}
          label={backButton.label}
          icon={backButton.icon as any}
        >
          {backButton.label}
        </FlatButton>
      )}
      <Text.Headline as="h1">Import default content types</Text.Headline>
      <Text.Body tone="secondary">
        Import default content type definitions from samples. Existing content
        types with the same key may be skipped or cause errors.
      </Text.Body>

      {error && (
        <Card>
          <Spacings.Stack scale="m">
            <Text.Headline as="h2">Error</Text.Headline>
            <Text.Body tone="critical">{error}</Text.Body>
          </Spacings.Stack>
        </Card>
      )}

      <Spacings.Inline scale="m" justifyContent="center">
        <PrimaryButton
          label={loading ? 'Importing…' : 'Import default content types'}
          onClick={handleImport}
          isDisabled={loading}
        />
      </Spacings.Inline>
      {result && (
        <Card>
          <Spacings.Stack scale="m">
            <Text.Headline as="h2">Result</Text.Headline>
            <Text.Body>
              Imported: {result.imported.length} content type
              {result.imported.length !== 1 ? 's' : ''}.
            </Text.Body>
            {result.imported.length > 0 && (
              <Text.Body tone="secondary">
                {result.imported.join(', ')}
              </Text.Body>
            )}
            {result.failed.length > 0 && (
              <>
                <Text.Body tone="critical">
                  Failed: {result.failed.length} content type
                  {result.failed.length !== 1 ? 's' : ''}.
                </Text.Body>
                <Spacings.Stack scale="s">
                  {result.failed.map(({ key, error: err }) => (
                    <Text.Body key={key} tone="critical">
                      {key}: {err}
                    </Text.Body>
                  ))}
                </Spacings.Stack>
              </>
            )}
          </Spacings.Stack>
        </Card>
      )}
    </Spacings.Stack>
  );
};

export default ImportContentTypes;
