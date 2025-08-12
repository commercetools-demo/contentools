import { useState, useCallback, useMemo } from 'react';
import {
  ContentTypeData,
  ContentTypeMetaData,
} from '@commercetools-demo/contentools-types';

const createDefaultContentType = (): ContentTypeData =>
  ({
    key: '',
    metadata: {
      type: '',
      name: '',
      icon: '',
      defaultProperties: {},
      propertySchema: {},
      isBuiltIn: false,
    },
  } as ContentTypeData);

export interface UseContentTypeFormReturn {
  contentType: ContentTypeData;
  isValid: boolean;
  hasChanges: boolean;
  updateContentType: (updates: Partial<ContentTypeData>) => void;
  updateMetadata: (updates: Partial<ContentTypeMetaData>) => void;
  resetForm: () => void;
  validateForm: () => boolean;
}

export const useContentTypeForm = (
  initialContentType?: ContentTypeData
): UseContentTypeFormReturn => {
  const [contentType, setContentType] = useState<ContentTypeData>(
    initialContentType ? { ...initialContentType } : createDefaultContentType()
  );

  const originalContentType = useMemo(
    () =>
      initialContentType
        ? { ...initialContentType }
        : createDefaultContentType(),
    [initialContentType]
  );

  const updateContentType = useCallback((updates: Partial<ContentTypeData>) => {
    setContentType((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const updateMetadata = useCallback(
    (updates: Partial<ContentTypeMetaData>) => {
      setContentType((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          ...updates,
        },
      }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setContentType(originalContentType);
  }, [originalContentType]);

  const validateForm = useCallback(() => {
    const { metadata } = contentType;
    return !!(metadata.type && metadata.name);
  }, [contentType]);

  const isValid = useMemo(() => validateForm(), [validateForm]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(contentType) !== JSON.stringify(originalContentType);
  }, [contentType, originalContentType]);

  return {
    contentType,
    isValid,
    hasChanges,
    updateContentType,
    updateMetadata,
    resetForm,
    validateForm,
  };
};
