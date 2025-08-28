import { useState, useCallback } from 'react';
import {
  MediaLibraryResult,
  MediaFile,
} from '@commercetools-demo/contentools-types';
import { fetchMediaLibrary, uploadFile } from '../api';

interface MediaLibraryState {
  files: MediaFile[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  loading: boolean;
  uploading: boolean;
  error: string | null;
  uploadError: string | null;
}

const initialState: MediaLibraryState = {
  files: [],
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
  },
  loading: false,
  uploading: false,
  error: null,
  uploadError: null,
};

export const useMediaLibrary = () => {
  const [state, setState] = useState<MediaLibraryState>(initialState);

  // Actions
  const fetchMedia = useCallback(
    async (
      hydratedUrl: string,
      extensions: string[] = [],
      page: number = 1,
      limit: number = 20
    ) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await fetchMediaLibrary(
          hydratedUrl,
          extensions,
          page,
          limit
        );

        setState((prev) => ({
          ...prev,
          files: result.files,
          pagination: result.pagination,
          loading: false,
        }));

        return result;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch media library',
        }));
        throw error;
      }
    },
    []
  );

  const uploadMediaFile = useCallback(
    async (
      hydratedUrl: string,
      file: File,
      title?: string,
      description?: string
    ) => {
      try {
        setState((prev) => ({ ...prev, uploading: true, uploadError: null }));
        const result = await uploadFile(hydratedUrl, file, title, description);

        // Create a new MediaFile object for the uploaded file
        const newMediaFile: MediaFile = {
          url: result.url,
          name: file.name,
          title: title || file.name,
          description,
          isImage: file.type.startsWith('image/'),
          createdAt: new Date(),
          size: file.size,
        };

        setState((prev) => ({
          ...prev,
          files: [newMediaFile, ...prev.files],
          pagination: {
            ...prev.pagination,
            totalItems: prev.pagination.totalItems + 1,
          },
          uploading: false,
        }));

        return result;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          uploading: false,
          uploadError:
            error instanceof Error ? error.message : 'Failed to upload file',
        }));
        throw error;
      }
    },
    []
  );

  const loadNextPage = useCallback(
    async (hydratedUrl: string, extensions: string[] = []) => {
      const nextPage = state.pagination.currentPage + 1;
      if (nextPage <= state.pagination.totalPages) {
        await fetchMedia(
          hydratedUrl,
          extensions,
          nextPage,
          state.pagination.limit
        );
      }
    },
    [fetchMedia, state.pagination]
  );

  const loadPreviousPage = useCallback(
    async (hydratedUrl: string, extensions: string[] = []) => {
      const prevPage = state.pagination.currentPage - 1;
      if (prevPage >= 1) {
        await fetchMedia(
          hydratedUrl,
          extensions,
          prevPage,
          state.pagination.limit
        );
      }
    },
    [fetchMedia, state.pagination]
  );

  const goToPage = useCallback(
    async (hydratedUrl: string, page: number, extensions: string[] = []) => {
      if (page >= 1 && page <= state.pagination.totalPages) {
        await fetchMedia(hydratedUrl, extensions, page, state.pagination.limit);
      }
    },
    [fetchMedia, state.pagination.totalPages]
  );

  const refreshMedia = useCallback(
    async (hydratedUrl: string, extensions: string[] = []) => {
      await fetchMedia(
        hydratedUrl,
        extensions,
        state.pagination.currentPage,
        state.pagination.limit
      );
    },
    [fetchMedia, state.pagination]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearUploadError = useCallback(() => {
    setState((prev) => ({ ...prev, uploadError: null }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, uploadError: null }));
  }, []);

  // Local actions
  const removeFileFromState = useCallback((fileUrl: string) => {
    setState((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.url !== fileUrl),
      pagination: {
        ...prev.pagination,
        totalItems: Math.max(0, prev.pagination.totalItems - 1),
      },
    }));
  }, []);

  const updateFileInState = useCallback(
    (fileUrl: string, updates: Partial<MediaFile>) => {
      setState((prev) => ({
        ...prev,
        files: prev.files.map((file) =>
          file.url === fileUrl ? { ...file, ...updates } : file
        ),
      }));
    },
    []
  );

  // Selectors
  const getFileByUrl = useCallback(
    (url: string) => {
      return state.files.find((file) => file.url === url) || null;
    },
    [state.files]
  );

  const getFilesByType = useCallback(
    (isImage: boolean) => {
      return state.files.filter((file) => file.isImage === isImage);
    },
    [state.files]
  );

  const getImageFiles = useCallback(() => {
    return getFilesByType(true);
  }, [getFilesByType]);

  const getNonImageFiles = useCallback(() => {
    return getFilesByType(false);
  }, [getFilesByType]);

  const hasNextPage = useCallback(() => {
    return state.pagination.currentPage < state.pagination.totalPages;
  }, [state.pagination]);

  const hasPreviousPage = useCallback(() => {
    return state.pagination.currentPage > 1;
  }, [state.pagination]);

  const getTotalFiles = useCallback(() => {
    return state.pagination.totalItems;
  }, [state.pagination.totalItems]);

  return {
    // State
    files: state.files,
    pagination: state.pagination,
    loading: state.loading,
    uploading: state.uploading,
    error: state.error,
    uploadError: state.uploadError,

    // Actions
    fetchMedia,
    uploadMediaFile,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    refreshMedia,
    clearError,
    clearUploadError,
    clearAllErrors,

    // Local actions
    removeFileFromState,
    updateFileInState,

    // Selectors
    getFileByUrl,
    getFilesByType,
    getImageFiles,
    getNonImageFiles,
    hasNextPage,
    hasPreviousPage,
    getTotalFiles,
  };
};
