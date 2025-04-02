import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchContentTypesEndpoint, createContentTypeEndpoint, updateContentTypeEndpoint, deleteContentTypeEndpoint } from '../utils/api';
import { RegistryState, RegistryComponentData } from '../types';

const initialState: RegistryState = {
  components: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchContentTypesThunk = createAsyncThunk(
  'content-type/fetchContentTypes',
  async ({ baseURL }: { baseURL: string }, { rejectWithValue }) => {
    try {
      const response = await fetchContentTypesEndpoint<RegistryComponentData>(baseURL);
      return response.map(item => item.value);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addContentTypeThunk = createAsyncThunk(
  'content-type/addContentType',
  async ({ baseURL, component }: { baseURL: string, component: RegistryComponentData }, { rejectWithValue }) => {
    try {
      const response = await createContentTypeEndpoint<RegistryComponentData>(baseURL, component.metadata.type, component);
      return response.value;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateContentTypeThunk = createAsyncThunk(
  'content-type/updateContentType',
  async ({ baseURL, key, component }: { baseURL: string, key: string, component: RegistryComponentData }, { rejectWithValue }) => {
    try {
      const response = await updateContentTypeEndpoint<RegistryComponentData>(baseURL, key, component);
      return response.value;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removeContentTypeThunk = createAsyncThunk(
  'content-type/removeContentType',
  async ({ baseURL, key }: { baseURL: string, key: string }, { rejectWithValue }) => {
    try {
      await deleteContentTypeEndpoint(baseURL, key);
      return key;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const registrySlice = createSlice({
  name: 'registry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch components
      .addCase(fetchContentTypesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentTypesThunk.fulfilled, (state, action) => {
        state.components = action.payload;
        state.loading = false;
      })
      .addCase(fetchContentTypesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add component
      .addCase(addContentTypeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContentTypeThunk.fulfilled, (state, action) => {
        state.components.push(action.payload);
        state.loading = false;
      })
      .addCase(addContentTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update component
      .addCase(updateContentTypeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContentTypeThunk.fulfilled, (state, action) => {
        const index = state.components.findIndex(
          component => component.metadata.type === action.payload.metadata.type
        );
        if (index !== -1) {
          state.components[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateContentTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove component
      .addCase(removeContentTypeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeContentTypeThunk.fulfilled, (state, action) => {
        state.components = state.components.filter(
          component => component.metadata.type !== action.payload
        );
        state.loading = false;
      })
      .addCase(removeContentTypeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default registrySlice.reducer;