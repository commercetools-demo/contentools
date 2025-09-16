import { ComponentPlayground } from '@commercetools-demo/contentools-content-type-code-editor';
import { ContentTypeData } from '@commercetools-demo/contentools-types';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const PreviewPanel = styled(Card)`
  padding: 20px;
  background: #f8f9fa;
`;
export interface PreviewTabProps {
  contentType: ContentTypeData;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
  onCodeChange: (updates: Partial<ContentTypeData>) => void;
}

const PreviewTab: React.FC<PreviewTabProps> = ({
  contentType,
  baseURL,
  businessUnitKey,
  locale,
  onCodeChange,
}) => {
  const props = useMemo(() => {
    return Object.keys(contentType.metadata.propertySchema || {}).join(', ');
  }, [contentType.metadata.propertySchema]);

  const handleCodeChange = (data: { transpiledCode: string; text: string }) => {
    return onCodeChange({
      code: {
        componentName: contentType.metadata.type,
        transpiledCode: data.transpiledCode,
        text: data.text,
      },
    });
  };

  const hasSchema =
    Object.keys(contentType.metadata.propertySchema || {}).length > 0;
  const hasValidType = contentType.metadata.type && contentType.metadata.name;

  if (!hasValidType) {
    return (
      <Spacings.Stack scale="m">
        <Text.Subheadline as="h4">Preview</Text.Subheadline>
        <Card>
          <Text.Body>
            Please fill in the content type name and type in the General tab to
            enable preview.
          </Text.Body>
        </Card>
      </Spacings.Stack>
    );
  }

  return (
    <Spacings.Stack scale="m">
      <Text.Subheadline as="h4">Code Editor</Text.Subheadline>

      <PreviewPanel>
        {hasSchema ? (
          <ComponentPlayground
            props={props}
            componentName={contentType.metadata.type}
            propertySchema={contentType.metadata.propertySchema}
            initialCode={contentType.code?.text}
            onCodeChange={handleCodeChange}
          />
        ) : (
          <Spacings.Stack scale="m">
            <Text.Detail tone="secondary">
              No component code available for preview.
            </Text.Detail>
          </Spacings.Stack>
        )}
      </PreviewPanel>
    </Spacings.Stack>
  );
};

export default PreviewTab;
