import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ContentItem, StateInfo } from '../types';
import {
  fetchContentItemsEndpoint,
  fetchPreviewContentItemEndpoint,
  createContentItemEndpoint,
  updateContentItemEndpoint,
  deleteContentItemEndpoint,
} from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

interface ContentItemState {
  items: ContentItem[];
  states: Record<string, StateInfo>;
  loading: boolean;
  error: string | null;
}

const initialState: ContentItemState = {
  items: [],
  states: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchContentItems = createAsyncThunk(
  'contentItem/fetchContentItems',
  async (baseURL: string, { rejectWithValue }) => {
    try {
      const result = await fetchContentItemsEndpoint<ContentItem>(baseURL);
      return {
        items: result.map(item => item.value),
        states: result.reduce(
          (acc, item) => {
            acc[item.key] = item.states;
            return acc;
          },
          {} as Record<string, StateInfo>
        ),
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const fetchContentItem = createAsyncThunk(
  'contentItem/fetchContentItem',
  async ({ baseURL, key }: { baseURL: string; key: string }, { rejectWithValue }) => {
    try {
      return await fetchPreviewContentItemEndpoint<ContentItem>(baseURL, key);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const createContentItem = createAsyncThunk(
  'contentItem/createContentItem',
  async (
    {
      baseURL,
      businessUnitKey,
      item,
    }: { baseURL: string; businessUnitKey: string; item: ContentItem },
    { rejectWithValue }
  ) => {
    try {
      const newItem = {
        key: `item-${uuidv4()}`,
        id: uuidv4(),
        businessUnitKey,
        ...(item as Omit<ContentItem, 'key' | 'id' | 'businessUnitKey'>),
      } as ContentItem;
      return await createContentItemEndpoint<ContentItem>(baseURL, newItem);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const updateContentItem = createAsyncThunk(
  'contentItem/updateContentItem',
  async (
    { baseURL, key, item }: { baseURL: string; key: string; item: ContentItem },
    { rejectWithValue }
  ) => {
    try {
      return await updateContentItemEndpoint<ContentItem>(baseURL, key, item);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const deleteContentItem = createAsyncThunk(
  'contentItem/deleteContentItem',
  async ({ baseURL, key }: { baseURL: string; key: string }, { rejectWithValue }) => {
    try {
      await deleteContentItemEndpoint(baseURL, key);
      return key;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

const contentItemSlice = createSlice({
  name: 'contentItem',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch Content Items
    builder
      .addCase(fetchContentItems.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.states = action.payload.states;
      })
      .addCase(fetchContentItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Content Item
    builder
      .addCase(createContentItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContentItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createContentItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Content Item
    builder
      .addCase(updateContentItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContentItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateContentItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Content Item
    builder
      .addCase(deleteContentItem.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContentItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteContentItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = contentItemSlice.actions;

export default contentItemSlice.reducer;
