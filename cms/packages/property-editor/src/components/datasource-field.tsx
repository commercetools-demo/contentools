import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Text from '@commercetools-uikit/text';
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
  const { datasources: availableDatasources, testDatasource } =
    useStateDatasource();

  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const selectedDatasource = useMemo(() => {
    return availableDatasources.find((ds) => ds.key === datasourceType);
  }, [availableDatasources, datasourceType]);

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

  const handleTestConnection = useCallback(async () => {
    if (!selectedDatasource) return;

    try {
      setLoading(true);
      const data = await testDatasource(
        selectedDatasource.key,
        value.params || {}
      );
      setTestResult({
        success: true,
        message: 'Connection test successful',
        data,
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Connection test failed',
        data: undefined,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDatasource, value.params, testDatasource]);

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

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <DatasourceConfig>
          <Spacings.Stack scale="xs" alignItems="flex-start">
            {selectedDatasource && (
              <>
                <Text.Detail isBold>Parameters</Text.Detail>
                {selectedDatasource.params.map((param) => (
                  <Spacings.Stack
                    scale="xs"
                    key={param.key}
                    alignItems="flex-start"
                  >
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
                  </Spacings.Stack>
                ))}

                <Spacings.Inline scale="s">
                  <SecondaryButton
                    label={loading ? 'Testing...' : 'Test Connection'}
                    onClick={handleTestConnection}
                    isDisabled={loading}
                    size="10"
                  />
                </Spacings.Inline>
              </>
            )}

            {testResult && (
              <Text.Detail tone={testResult.success ? 'positive' : 'critical'}>
                {testResult.message}
              </Text.Detail>
            )}
          </Spacings.Stack>
        </DatasourceConfig>
      </HighlightedContainer>
      {validationError && (
        <Text.Detail tone="negative">{validationError}</Text.Detail>
      )}
    </Spacings.Stack>
  );
};
