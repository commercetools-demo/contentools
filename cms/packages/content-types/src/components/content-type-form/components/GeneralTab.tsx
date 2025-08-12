import React from 'react';
import { ContentTypeData } from '@commercetools-demo/contentools-types';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import FieldLabel from '@commercetools-uikit/field-label';
import styled from 'styled-components';

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

export interface GeneralTabProps {
  contentType: ContentTypeData;
  onContentTypeChange: (updates: Partial<ContentTypeData>) => void;
  isEdit: boolean;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  contentType,
  onContentTypeChange,
  isEdit,
}) => {
  const handleMetadataChange =
    (field: keyof ContentTypeData['metadata']) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onContentTypeChange({
        metadata: {
          ...contentType.metadata,
          [field]: event.target.value,
        },
      });
    };

  return (
    <Spacings.Stack scale="m">
      <Text.Subheadline as="h4">General Information</Text.Subheadline>

      <FormRow>
        <FormField>
          <FieldLabel
            title="Content Type Name"
            hint="Display name for this content type"
            htmlFor="content-type-name"
          />
          <TextInput
            id="content-type-name"
            value={contentType.metadata.name}
            onChange={handleMetadataChange('name')}
            placeholder="e.g., Hero Banner"
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField>
          <FieldLabel
            title="Component Type"
            hint="Technical type identifier, no spaces or special characters"
            htmlFor="content-type-type"
          />
          <TextInput
            id="content-type-type"
            value={contentType.metadata.type}
            onChange={handleMetadataChange('type')}
            placeholder="e.g., HeroBanner"
            isDisabled={isEdit}
          />
        </FormField>

        <FormField>
          <FieldLabel
            title="Icon"
            hint="Icon/Emoji for this content type"
            htmlFor="content-type-icon"
          />
          <TextInput
            id="content-type-icon"
            value={contentType.metadata.icon || ''}
            onChange={handleMetadataChange('icon')}
            placeholder="e.g., image or icon-name"
          />
        </FormField>
      </FormRow>

      {isEdit && (
        <Text.Detail tone="information">
          Note: Content Type Key and Component Type cannot be changed after
          creation.
        </Text.Detail>
      )}
    </Spacings.Stack>
  );
};

export default GeneralTab;
