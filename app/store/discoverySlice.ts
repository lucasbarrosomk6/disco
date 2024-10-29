import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Discovery, Process, CompanyList } from './discoAITypes';
import { RootState, AppDispatch } from '.';

// Create an async thunk for running the process
export const runProcessThunk = createAsyncThunk<
  void,
  Discovery,
  { dispatch: AppDispatch; state: RootState }
>(
  'discovery/runProcess',
  async (discovery, { getState, dispatch }) => {
    const state = getState();
    const processes = state.processes.list.filter(p => discovery.processIds.includes(p.id));
    const companyList = state.companyLists.list.find(c => c.id === discovery.companyListId);

    if (!companyList) {
      throw new Error('Company list not found');
    }

    const response = await fetch('/api/runProcess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        processes,
        companyList,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start process');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          if (data.result) {
            dispatch(addDiscoveryResult({ 
              id: discovery.id, 
              result: data.result 
            }));
          } else {
            dispatch(updateDiscoveryStatus({ 
              id: discovery.id, 
              status: data.message 
            }));
          }
        }
      }
    }
  }
);

interface DiscoveryState {
    list: Discovery[];
    currentDiscovery: Discovery | null;
}

const initialState: DiscoveryState = {
    list: [],
    currentDiscovery: null,
};

const discoverySlice = createSlice({
    name: 'discovery',
    initialState,
    reducers: {
        setDiscoveries: (state, action: PayloadAction<Discovery[]>) => {
            state.list = action.payload;
        },
        setCurrentDiscovery: (state, action: PayloadAction<Discovery | null>) => {
            state.currentDiscovery = action.payload;
        },
        addDiscovery: (state, action: PayloadAction<Discovery>) => {
            state.list.unshift(action.payload); // Add to the beginning of the list
        },
        updateDiscovery: (state, action: PayloadAction<Discovery>) => {
            const index = state.list.findIndex(d => d.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        deleteDiscovery: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(d => d.id !== action.payload);
        },
        updateDiscoveryStatus: (state, action: PayloadAction<{ 
          id: number; 
          status: string; 
        }>) => {
            const discovery = state.list.find(d => d.id === action.payload.id);
            if (discovery) {
                discovery.status = action.payload.status;
                // Move the updated discovery to the top of the list
                state.list = [discovery, ...state.list.filter(d => d.id !== discovery.id)];
            }
        },
        addDiscoveryResult: (state, action: PayloadAction<{
          id: number;
          result: { output: string; companyName: string; processName: string };
        }>) => {
            const discovery = state.list.find(d => d.id === action.payload.id);
            if (discovery) {
                if (!discovery.results) {
                    discovery.results = [];
                }
                const existingResultIndex = discovery.results.findIndex(r => r.companyName === action.payload.result.companyName);
                if (existingResultIndex !== -1) {
                    discovery.results[existingResultIndex].output += `\n\n${action.payload.result.output}`;
                } else {
                    discovery.results.push(action.payload.result);
                }
                // Move the updated discovery to the top of the list
                state.list = [discovery, ...state.list.filter(d => d.id !== discovery.id)];
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(runProcessThunk.fulfilled, (state, action) => {
                // You can update the discovery status here if needed
                console.log('Process started successfully');
            })
            .addCase(runProcessThunk.rejected, (state, action) => {
                console.error('Failed to start process:', action.error);
                // You can update the discovery status here if needed
            });
    },
});

export const {
    setDiscoveries,
    setCurrentDiscovery,
    addDiscovery,
    updateDiscovery,
    deleteDiscovery,
    updateDiscoveryStatus,
    addDiscoveryResult,
} = discoverySlice.actions;

export default discoverySlice.reducer;