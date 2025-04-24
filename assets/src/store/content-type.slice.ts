import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchContentTypesEndpoint,
  createContentTypeEndpoint,
  updateContentTypeEndpoint,
  deleteContentTypeEndpoint,
  getAvailableDatasourcesEndpoint,
} from '../utils/api';
import { ContentTypeState, ContentTypeData, DatasourceInfo } from '../types';

const initialState: ContentTypeState = {
  contentTypes: [],
  loading: false,
  error: null,
  availableDatasources: [],
};

// Thunks
export const fetchContentTypesThunk = createAsyncThunk(
  'content-type/fetchContentTypes',
  async ({ baseURL }: { baseURL: string }, { rejectWithValue }) => {
    try {
      const response = await fetchContentTypesEndpoint<ContentTypeData>(baseURL);
      return response.map(item => item.value);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchAvailableDatasourcesThunk = createAsyncThunk(
  'content-type/fetchAvailableDatasources',
  async ({ baseURL }: { baseURL: string }, { rejectWithValue }) => {
    try {
      const response = await getAvailableDatasourcesEndpoint<DatasourceInfo>(baseURL);
      return response.map(item => item.value as DatasourceInfo);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addContentTypeThunk = createAsyncThunk(
  'content-type/addContentType',
  async (
    { baseURL, contentType }: { baseURL: string; contentType: ContentTypeData },
    { rejectWithValue }
  ) => {
    try {
      const response = await createContentTypeEndpoint<ContentTypeData>(
        baseURL,
        contentType.metadata.type,
        contentType
      );
      return response.value;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateContentTypeThunk = createAsyncThunk(
  'content-type/updateContentType',
  async (
    { baseURL, key, contentType }: { baseURL: string; key: string; contentType: ContentTypeData },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateContentTypeEndpoint<ContentTypeData>(baseURL, key, contentType);
      return response.value;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removeContentTypeThunk = createAsyncThunk(
  'content-type/removeContentType',
  async ({ baseURL, key }: { baseURL: string; key: string }, { rejectWithValue }) => {
    try {
      await deleteContentTypeEndpoint(baseURL, key);
      return key;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const contentTypeSlice = createSlice({
  name: 'contentType',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch components
      .addCase(fetchContentTypesThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentTypesThunk.fulfilled, (state, action) => {
        state.contentTypes = action.payload;
        state.loading = false;
      })
      .addCase(fetchContentTypesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch available datasources
      .addCase(fetchAvailableDatasourcesThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableDatasourcesThunk.fulfilled, (state, action) => {
        state.availableDatasources = action.payload;
        state.loading = false;
      })
      .addCase(fetchAvailableDatasourcesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add component
      .addCase(addContentTypeThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContentTypeThunk.fulfilled, (state, action) => {
        state.contentTypes.push(action.payload);
        state.loading = false;
      })
      .addCase(addContentTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update component
      .addCase(updateContentTypeThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContentTypeThunk.fulfilled, (state, action) => {
        const index = state.contentTypes.findIndex(
          contentType => contentType.metadata.type === action.payload.metadata.type
        );
        if (index !== -1) {
          state.contentTypes[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateContentTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove component
      .addCase(removeContentTypeThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeContentTypeThunk.fulfilled, (state, action) => {
        state.contentTypes = state.contentTypes.filter(
          contentType => contentType.metadata.type !== action.payload
        );
        state.loading = false;
      })
      .addCase(removeContentTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default contentTypeSlice.reducer;
