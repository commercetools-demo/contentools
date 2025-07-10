import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ContentItem, Page, ContentItemStates, PageStates, StateManagementState } from '@commercetools-demo/cms-types';
import {
  getStatesEndpoint,
  saveDraftEndpoint,
  publishEndpoint,
  revertDraftEndpoint,
} from './api';

const initialState: StateManagementState = {
  states: {},
  currentState: null,
  contentType: 'content-items',
  loading: false,
  error: null,
};

// Fetch states
export const fetchStates = createAsyncThunk(
  'state/fetchStates',
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
      const result = await getStatesEndpoint<ContentItemStates | PageStates>(
        baseURL,
        contentType,
        key
      );
      return {
        states: result.states || {},
        contentType,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

// Save draft state
export const saveDraft = createAsyncThunk(
  'state/saveDraft',
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
      const result = await saveDraftEndpoint<ContentItem | Page>(baseURL, contentType, key, item);

      return {
        states: result.states,
        contentType,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

// Publish state
export const publish = createAsyncThunk(
  'state/publish',
  async (
    {
      baseURL,
      contentType,
      key,
      item,
      clearDraft = false,
    }: {
      baseURL: string;
      contentType: 'content-items' | 'pages';
      key: string;
      item: ContentItem | Page;
      clearDraft?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await publishEndpoint<ContentItem | Page>(
        baseURL,
        contentType,
        key,
        item,
        clearDraft
      );

      return {
        states: result.states,
        contentType,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

// Revert to published state
export const revertToPublished = createAsyncThunk(
  'state/revertToPublished',
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
    { rejectWithValue, dispatch }
  ) => {
    try {
      await revertDraftEndpoint(baseURL, contentType, key);

      // Refresh states after revert
      dispatch(fetchStates({ baseURL, contentType, key }));

      return { success: true };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

// Update current state based on state data
function determineCurrentState(states: {
  draft?: any;
  published?: any;
}): 'draft' | 'published' | 'both' | null {
  if (states?.draft && states?.published) {
    return 'both';
  } else if (states?.draft) {
    return 'draft';
  } else if (states?.published) {
    return 'published';
  }
  return null;
}

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setContentType: (state, action) => {
      state.contentType = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch states
    builder
      .addCase(fetchStates.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload.states;
        state.contentType = action.payload.contentType;
        state.currentState = determineCurrentState(action.payload.states);
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Save draft
    builder
      .addCase(saveDraft.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload.states;
        state.currentState = determineCurrentState(action.payload.states);
      })
      .addCase(saveDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Publish
    builder
      .addCase(publish.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publish.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload.states;
        state.currentState = determineCurrentState(action.payload.states);
      })
      .addCase(publish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Revert to published
    builder
      .addCase(revertToPublished.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revertToPublished.fulfilled, state => {
        state.loading = false;
        // States will be updated by the following fetchStates dispatch
      })
      .addCase(revertToPublished.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setContentType } = stateSlice.actions;

export default stateSlice.reducer;
