import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Text from '@commercetools-uikit/text';
import { MediaFile } from '@commercetools-demo/cms-types';

const HighlightedContainer = styled.div<{ $highlight: boolean }>`
  position: relative;
  
  ${({ $highlight }) => $highlight && `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(90deg, #ffd700, #ffed4e);
      border-radius: 4px;
      z-index: -1;
    }
  `}
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
`;

const FilePreviewImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
`;

const FilePreviewInfo = styled.div`
  flex: 1;
`;

const FileInput = styled.input`
  display: none;
`;

interface FileFieldProps {
  fieldKey: string;
  label: string;
  value: MediaFile | null | undefined;
  highlight?: boolean;
  required?: boolean;
  baseURL: string;
  businessUnitKey: string;
  extensions?: string[];
  onFieldChange: (key: string, value: any) => void;
}

export const FileField: React.FC<FileFieldProps> = ({
  fieldKey,
  label,
  value,
  highlight = false,
  required = false,
  baseURL,
  businessUnitKey,
  extensions = [],
  onFieldChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file extension if specified
    if (extensions.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !extensions.includes(fileExtension)) {
        setError(`File type not supported. Allowed types: ${extensions.join(', ')}`);
        return;
      }
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('businessUnitKey', businessUnitKey);

      const response = await fetch(`${baseURL}/api/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const uploadedFile: MediaFile = await response.json();
      onFieldChange(fieldKey, uploadedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [fieldKey, baseURL, businessUnitKey, extensions, onFieldChange]);

  const handleRemoveFile = useCallback(() => {
    onFieldChange(fieldKey, null);
  }, [fieldKey, onFieldChange]);

  const handleMediaLibrary = useCallback(() => {
    // TODO: Implement media library integration
    console.log('Media library not implemented yet');
  }, []);

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />
      <HighlightedContainer $highlight={highlight}>
        <Spacings.Stack scale="xs">
          {value && (
            <FilePreview>
              {value.isImage && (
                <FilePreviewImage
                  src={value.url}
                  alt={value.name}
                />
              )}
              <FilePreviewInfo>
                <Text.Detail isBold>{value.name}</Text.Detail>
                {value.description && (
                  <Text.Detail>{value.description}</Text.Detail>
                )}
                {value.size && (
                  <Text.Detail>
                    {Math.round(value.size / 1024)} KB
                  </Text.Detail>
                )}
              </FilePreviewInfo>
              <SecondaryButton
                label="Remove"
                size="small"
                onClick={handleRemoveFile}
              />
            </FilePreview>
          )}
          
          {!value && (
            <Spacings.Inline scale="s">
              <FileInput
                id={fieldKey}
                type="file"
                accept={extensions.length > 0 ? extensions.map(ext => `.${ext}`).join(',') : undefined}
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <SecondaryButton
                as="label"
                htmlFor={fieldKey}
                label={uploading ? 'Uploading...' : 'Upload File'}
                isDisabled={uploading}
              />
              <SecondaryButton
                label="Media Library"
                onClick={handleMediaLibrary}
              />
            </Spacings.Inline>
          )}
          
          {error && (
            <Text.Detail tone="critical">{error}</Text.Detail>
          )}
        </Spacings.Stack>
      </HighlightedContainer>
    </Spacings.Stack>
  );
}; 