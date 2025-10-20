import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';
import FieldLabel from '@commercetools-uikit/field-label';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import {
  Modal,
  useModalState,
} from '@commercetools-demo/contentools-ui-components';
import { useStateMediaLibrary } from '@commercetools-demo/contentools-state';
import { MediaFile } from '@commercetools-demo/contentools-types';

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

const FileInputContainer = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #2196f3;
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 16px;
  max-height: 400px;
  overflow-y: auto;
`;

const MediaItem = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$selected ? '#2196f3' : 'transparent')};
  padding: 8px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.$selected ? 'rgba(33, 150, 243, 0.1)' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    border-color: #2196f3;
    background-color: rgba(33, 150, 243, 0.05);
  }
`;

const MediaThumbnail = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f5f5f5;
`;

const MediaThumbnailImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
`;

const MediaName = styled.div`
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileIcon = styled.div`
  font-size: 32px;
  color: #666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const SelectedFileInfo = styled.div`
  flex: 1;
  margin-right: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

interface FileFieldProps {
  fieldKey: string;
  label: string;
  value: MediaFile | null | undefined;
  highlight?: boolean;
  required?: boolean;
  validationError?: string;
  baseURL: string;
  businessUnitKey: string;
  extensions?: string[];
  onFieldChange: (value: any) => void;
}

export const FileField: React.FC<FileFieldProps> = ({
  fieldKey,
  label,
  value,
  highlight = false,
  required = false,
  validationError,
  baseURL,
  businessUnitKey,
  extensions = [],
  onFieldChange,
}) => {
  const {
    fetchMedia,
    uploadMediaFile,
    files,
    pagination,
    hasPreviousPage,
    hasNextPage,
    loadPreviousPage,
    loadNextPage,
    loading,
    uploading,
    error: mediaLibraryError,
  } = useStateMediaLibrary()!;
  const uploadModal = useModalState(false);
  const selectModal = useModalState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMediaFile, setSelectedMediaFile] = useState<MediaFile | null>(
    null
  );
  const [fileTitle, setFileTitle] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  const handleOpenModal = useCallback(() => {
    fetchMedia(hydratedUrl, extensions, 1, 20);
    selectModal.openModal();
  }, [selectModal]);

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file extension if specified
      if (extensions.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !extensions.includes(fileExtension)) {
          setError(
            `File type not supported. Allowed types: ${extensions.join(', ')}`
          );
          return;
        }
      }

      setSelectedFile(file);
      setError(null);
    },
    [extensions]
  );

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadMediaFile(
        hydratedUrl,
        selectedFile,
        fileTitle || selectedFile.name,
        fileDescription
      );

      // Create MediaFile object for the uploaded file
      const mediaFile: MediaFile = {
        url: result.url,
        name: selectedFile.name,
        title: fileTitle || selectedFile.name,
        description: fileDescription,
        isImage: selectedFile.type.startsWith('image/'),
        createdAt: new Date(),
        size: selectedFile.size,
      };

      onFieldChange(mediaFile);
      uploadModal.closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }, [
    selectedFile,
    fileTitle,
    fileDescription,
    uploadMediaFile,
    onFieldChange,
    uploadModal,
  ]);

  const handleMediaFileSelect = useCallback((file: MediaFile) => {
    setSelectedMediaFile(file);
  }, []);

  const handleConfirmSelection = useCallback(() => {
    if (selectedMediaFile) {
      onFieldChange(selectedMediaFile);
      selectModal.closeModal();
    }
  }, [selectedMediaFile, onFieldChange, selectModal]);

  const handleRemoveFile = useCallback(() => {
    onFieldChange(null);
  }, [onFieldChange]);

  const handleFileInputClick = useCallback(() => {
    setError(null);
    fileInputRef.current?.click();
  }, []);

  const getFileTooltip = useCallback((file: MediaFile): string => {
    const parts: string[] = [];
    if (file.title) parts.push(`Title: ${file.title}`);
    if (file.description) parts.push(`Description: ${file.description}`);
    if (!file.title && !file.description) parts.push(file.name);
    return parts.join('\n');
  }, []);

  const renderFilePreview = (file: MediaFile) => (
    <FilePreview>
      {file.isImage && <FilePreviewImage src={file.url} alt={file.name} />}
      <FilePreviewInfo>
        <Text.Detail isBold>{file.title || file.name}</Text.Detail>
        {file.description && <Text.Detail>{file.description}</Text.Detail>}
        {file.size && (
          <Text.Detail>{Math.round(file.size / 1024)} KB</Text.Detail>
        )}
      </FilePreviewInfo>
      <SecondaryButton label="Remove" size="small" onClick={handleRemoveFile} />
    </FilePreview>
  );

  const renderMediaGrid = () => (
    <>
      <MediaGrid>
        {files.map((file) => (
          <MediaItem
            key={file.url}
            $selected={selectedMediaFile?.url === file.url}
            onClick={() => handleMediaFileSelect(file)}
            title={getFileTooltip(file)}
          >
            <MediaThumbnail>
              {file.isImage ? (
                <MediaThumbnailImage
                  src={file.url}
                  alt={file.title || file.name}
                />
              ) : (
                <FileIcon>📄</FileIcon>
              )}
            </MediaThumbnail>
            <MediaName>{file.title || file.name}</MediaName>
          </MediaItem>
        ))}
      </MediaGrid>

      {pagination.totalPages > 1 && (
        <Pagination>
          <SecondaryButton
            label="Previous"
            size="small"
            isDisabled={!hasPreviousPage()}
            onClick={() => loadPreviousPage(hydratedUrl, extensions)}
          />
          <Text.Detail>
            {pagination.currentPage} of {pagination.totalPages}
          </Text.Detail>
          <SecondaryButton
            label="Next"
            size="small"
            isDisabled={!hasNextPage()}
            onClick={() => loadNextPage(hydratedUrl, extensions)}
          />
        </Pagination>
      )}
    </>
  );

  // Reset form when modals close
  useEffect(() => {
    if (!uploadModal.isModalOpen) {
      setSelectedFile(null);
      setFileTitle('');
      setFileDescription('');
      setError(null);
    }
  }, [uploadModal.isModalOpen]);

  useEffect(() => {
    if (!selectModal.isModalOpen) {
      setSelectedMediaFile(null);
    }
  }, [selectModal.isModalOpen]);

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={label}
        hasRequiredIndicator={required}
        htmlFor={fieldKey}
      />

      <HighlightedContainer $highlight={highlight}>
        <Spacings.Stack scale="xs">
          {value ? (
            renderFilePreview(value)
          ) : (
            <Spacings.Inline scale="s">
              <SecondaryButton
                label="Upload File"
                onClick={uploadModal.openModal}
              />
              <SecondaryButton
                label="Select from Library"
                onClick={handleOpenModal}
              />
            </Spacings.Inline>
          )}
        </Spacings.Stack>
      </HighlightedContainer>

      {validationError && (
        <Text.Detail tone="negative">{validationError}</Text.Detail>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModal.isModalOpen}
        onClose={uploadModal.closeModal}
        title="Upload a new file"
        size={50}
      >
        <Spacings.Stack scale="m">
          <Spacings.Stack scale="s">
            <FieldLabel title="Title" />
            <TextInput
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              placeholder="Enter file title"
            />
          </Spacings.Stack>

          <Spacings.Stack scale="s">
            <FieldLabel title="Description" />
            <TextInput
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              placeholder="Enter file description"
            />
          </Spacings.Stack>

          <Spacings.Stack scale="s">
            <FieldLabel title="File" />
            <FileInputContainer onClick={handleFileInputClick}>
              {selectedFile ? (
                <Text.Detail>Selected: {selectedFile.name}</Text.Detail>
              ) : (
                <Text.Detail>Click to select a file</Text.Detail>
              )}
              <FileInput
                ref={fileInputRef}
                type="file"
                accept={
                  extensions.length > 0
                    ? extensions.map((ext) => `.${ext}`).join(',')
                    : undefined
                }
                onChange={handleFileInputChange}
              />
            </FileInputContainer>
          </Spacings.Stack>

          {error && <Text.Detail tone="critical">{error}</Text.Detail>}

          <ModalFooter>
            <SelectedFileInfo>
              {selectedFile && (
                <Text.Detail isBold>{selectedFile.name}</Text.Detail>
              )}
            </SelectedFileInfo>
            <ButtonGroup>
              <SecondaryButton
                label="Cancel"
                onClick={uploadModal.closeModal}
              />
              <PrimaryButton
                label={uploading ? 'Uploading...' : 'Upload'}
                isDisabled={!selectedFile || uploading}
                onClick={handleFileUpload}
              />
            </ButtonGroup>
          </ModalFooter>
        </Spacings.Stack>
      </Modal>

      {/* Select from Library Modal */}
      <Modal
        isOpen={selectModal.isModalOpen}
        onClose={selectModal.closeModal}
        title="Select from Media Library"
        size={70}
      >
        <Spacings.Stack scale="m">
          {loading ? (
            <Text.Detail>Loading media files...</Text.Detail>
          ) : files.length === 0 ? (
            <Text.Detail>
              No files found
              {extensions.length > 0
                ? ` with extensions: ${extensions.join(', ')}`
                : ''}
              .
            </Text.Detail>
          ) : (
            renderMediaGrid()
          )}

          {mediaLibraryError && (
            <Text.Detail tone="critical">{mediaLibraryError}</Text.Detail>
          )}

          <ModalFooter>
            <SelectedFileInfo>
              {selectedMediaFile && (
                <Spacings.Stack scale="xs">
                  <Text.Detail isBold>
                    {selectedMediaFile.title || selectedMediaFile.name}
                  </Text.Detail>
                  {selectedMediaFile.description && (
                    <Text.Detail>{selectedMediaFile.description}</Text.Detail>
                  )}
                </Spacings.Stack>
              )}
            </SelectedFileInfo>
            <ButtonGroup>
              <SecondaryButton
                label="Cancel"
                onClick={selectModal.closeModal}
              />
              <PrimaryButton
                label="Select"
                isDisabled={!selectedMediaFile}
                onClick={handleConfirmSelection}
              />
            </ButtonGroup>
          </ModalFooter>
        </Spacings.Stack>
      </Modal>
    </Spacings.Stack>
  );
};
