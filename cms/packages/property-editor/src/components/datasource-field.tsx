import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Text from '@commercetools-uikit/text';
import { DatasourceInfo } from '@commercetools-demo/cms-types';
import { useStateDatasource } from '@commercetools-demo/cms-state';

const HighlightedContainer = styled.div<{ $highlight: boolean }>`
  position: relative;

  ${({ $highlight }) =>
    $highlight &&
    `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(90deg, #ffd700, #ffed4e);
      border-radius: 4px;
      z-index: 0;
    }
  `}
`;

const DatasourceConfig = styled.div`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
`;

const ParamInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const DatasourceSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

interface DatasourceFieldProps {
  fieldKey: string;
  label: string;
  value: Record<string, any>;
  highlight?: boolean;
  required?: boolean;
  validationError?: string;
  datasourceType: string;
  baseURL: string;
  onFieldChange: (key: string, value: any) => void;
}

export const DatasourceField: React.FC<DatasourceFieldProps> = ({
  fieldKey,
  label,
  value,
  highlight = false,
  required = false,
  validationError,
  datasourceType,
  baseURL,
  onFieldChange,
}) => {
  const { datasources: availableDatasources } = useStateDatasource();
  const [selectedDatasource, setSelectedDatasource] =
    useState<DatasourceInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set selected datasource when available datasources change
  useEffect(() => {
    if (availableDatasources.length > 0) {
      setSelectedDatasource(availableDatasources[0]);
    }
  }, [availableDatasources]);

  const handleParamChange = useCallback(
    (paramKey: string, paramValue: string) => {
      const newValue = {
        ...value,
        params: {
          ...value.params,
          [paramKey]: paramValue,
        },
      };
      onFieldChange(fieldKey, newValue);
    },
    [fieldKey, value, onFieldChange]
  );

  const handleDatasourceChange = useCallback(
    (datasourceKey: string) => {
      const datasource = availableDatasources.find(
        (ds) => ds.key === datasourceKey
      );
      if (datasource) {
        setSelectedDatasource(datasource);
        const newValue = {
          datasource: datasourceKey,
          params: {},
        };
        onFieldChange(fieldKey, newValue);
      }
    },
    [availableDatasources, fieldKey, onFieldChange]
  );

  const handleTestConnection = useCallback(async () => {
    if (!selectedDatasource) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${baseURL}/api/datasources/${selectedDatasource.key}/test`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ params: value.params || {} }),
        }
      );

      if (!response.ok) {
        throw new Error('Connection test failed');
      }

      const result = await response.json();
      console.log('Connection test result:', result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
    } finally {
      setLoading(false);
    }
  }, [baseURL, selectedDatasource, value.params]);

  if (loading && !selectedDatasource) {
    return (
      <Spacings.Stack scale="xs">
        <FieldLabel
          title={label}
          hasRequiredIndicator={required}
          htmlFor={fieldKey}
        />
        <Text.Body>Loading datasources...</Text.Body>
      </Spacings.Stack>
    );
  }

  if (error && !selectedDatasource) {
    return (
      <Spacings.Stack scale="xs">
        <FieldLabel
          title={label}
          hasRequiredIndicator={required}
          htmlFor={fieldKey}
        />
        <Text.Body tone="critical">{error}</Text.Body>
      </Spacings.Stack>
    );
  }

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <DatasourceConfig>
          <Spacings.Stack scale="xs">
            <div>
              <Text.Detail isBold>Datasource</Text.Detail>
              <DatasourceSelect
                value={value.datasource || ''}
                onChange={(e) => handleDatasourceChange(e.target.value)}
              >
                <option value="">Select a datasource</option>
                {availableDatasources.map((ds) => (
                  <option key={ds.key} value={ds.key}>
                    {ds.name}
                  </option>
                ))}
              </DatasourceSelect>
            </div>

            {selectedDatasource && (
              <>
                <Text.Detail isBold>Parameters</Text.Detail>
                {selectedDatasource.params.map((param) => (
                  <div key={param.key}>
                    <Text.Detail>
                      {param.key} ({param.type})
                      {param.required && (
                        <span style={{ color: 'red' }}>*</span>
                      )}
                    </Text.Detail>
                    <ParamInput
                      type="text"
                      placeholder={`Enter ${param.key}`}
                      value={value.params?.[param.key] || ''}
                      onChange={(e) =>
                        handleParamChange(param.key, e.target.value)
                      }
                    />
                  </div>
                ))}

                <Spacings.Inline scale="s">
                  <SecondaryButton
                    label={loading ? 'Testing...' : 'Test Connection'}
                    onClick={handleTestConnection}
                    isDisabled={loading}
                    size="small"
                  />
                </Spacings.Inline>
              </>
            )}

            {error && <Text.Detail tone="critical">{error}</Text.Detail>}
          </Spacings.Stack>
        </DatasourceConfig>
      </HighlightedContainer>
      {validationError && (
        <Text.Detail tone="negative">{validationError}</Text.Detail>
      )}
    </Spacings.Stack>
  );
};
