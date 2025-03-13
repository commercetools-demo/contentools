import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RegistryState, RegistryComponentData } from '../types';
import { fetchRegistry, createRegistryComponent, updateRegistryComponent, deleteRegistryComponent } from '../utils/api';

const initialState: RegistryState = {
  components: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchRegistryComponents = createAsyncThunk(
  'registry/fetchRegistryComponents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchRegistry<RegistryComponentData>();
      return response.map(item => item.value);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addRegistryComponent = createAsyncThunk(
  'registry/addRegistryComponent',
  async (component: RegistryComponentData, { rejectWithValue }) => {
    try {
      const response = await createRegistryComponent<RegistryComponentData>(component);
      return response.value;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateRegistryComponentThunk = createAsyncThunk(
  'registry/updateRegistryComponent',
  async ({ key, component }: { key: string, component: RegistryComponentData }, { rejectWithValue }) => {
    try {
      const response = await updateRegistryComponent<RegistryComponentData>(key, component);
      return response.value;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removeRegistryComponent = createAsyncThunk(
  'registry/removeRegistryComponent',
  async (key: string, { rejectWithValue }) => {
    try {
      await deleteRegistryComponent(key);
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
      .addCase(fetchRegistryComponents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegistryComponents.fulfilled, (state, action) => {
        state.components = action.payload;
        state.loading = false;
      })
      .addCase(fetchRegistryComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add component
      .addCase(addRegistryComponent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRegistryComponent.fulfilled, (state, action) => {
        state.components.push(action.payload);
        state.loading = false;
      })
      .addCase(addRegistryComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update component
      .addCase(updateRegistryComponentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegistryComponentThunk.fulfilled, (state, action) => {
        const index = state.components.findIndex(
          component => component.metadata.type === action.payload.metadata.type
        );
        if (index !== -1) {
          state.components[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateRegistryComponentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove component
      .addCase(removeRegistryComponent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeRegistryComponent.fulfilled, (state, action) => {
        state.components = state.components.filter(
          component => component.metadata.type !== action.payload
        );
        state.loading = false;
      })
      .addCase(removeRegistryComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default registrySlice.reducer;