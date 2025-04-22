import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ContentItem, Page, VersionInfo, ContentItemVersions, PageVersions } from '../types';
import { fetchVersionsEndpoint, saveVersionEndpoint, getVersionEndpoint } from '../utils/api';

interface VersionState {
  versions: VersionInfo[];
  selectedVersion: VersionInfo | null;
  contentType: 'content-items' | 'pages';
  loading: boolean;
  error: string | null;
}

const initialState: VersionState = {
  versions: [],
  selectedVersion: null,
  contentType: 'content-items',
  loading: false,
  error: null,
};

// Fetch versions
export const fetchVersions = createAsyncThunk(
  'version/fetchVersions',
  async (
    {
      baseURL,
      contentType,
      key,
    }: {
      baseURL: string;
      contentType: 'content-items' | 'pages';
      key: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await fetchVersionsEndpoint<ContentItemVersions | PageVersions>(
        baseURL,
        contentType,
        key
      );
      return {
        versions: result.versions || [],
        contentType,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

// Save a new version
export const saveVersion = createAsyncThunk(
  'version/saveVersion',
  async (
    {
      baseURL,
      contentType,
      key,
      item,
    }: {
      baseURL: string;
      contentType: 'content-items' | 'pages';
      key: string;
      item: ContentItem | Page;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await saveVersionEndpoint<ContentItem | Page>(baseURL, contentType, key, item);

      return result.versions;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

// Get a specific version
export const getVersion = createAsyncThunk(
  'version/getVersion',
  async (
    {
      baseURL,
      contentType,
      key,
      versionId,
    }: {
      baseURL: string;
      contentType: 'content-items' | 'pages';
      key: string;
      versionId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await getVersionEndpoint<VersionInfo>(baseURL, contentType, key, versionId);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

const versionSlice = createSlice({
  name: 'version',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    selectVersion: (state, action) => {
      state.selectedVersion =
        state.versions.find(v => 'id' in v && v.id === action.payload) || null;
    },
    clearSelectedVersion: state => {
      state.selectedVersion = null;
    },
    setContentType: (state, action) => {
      state.contentType = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch versions
    builder
      .addCase(fetchVersions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVersions.fulfilled, (state, action) => {
        state.loading = false;
        state.versions = action.payload.versions;
        state.contentType = action.payload.contentType;
      })
      .addCase(fetchVersions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Save version
    builder
      .addCase(saveVersion.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveVersion.fulfilled, (state, action) => {
        state.loading = false;
        state.versions = action.payload;
      })
      .addCase(saveVersion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get version
    builder
      .addCase(getVersion.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVersion.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVersion = action.payload;
      })
      .addCase(getVersion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, selectVersion, clearSelectedVersion, setContentType } =
  versionSlice.actions;

export default versionSlice.reducer;
