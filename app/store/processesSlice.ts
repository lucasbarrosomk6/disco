import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import * as api from '../api/processes';
import { Process } from './discoAITypes';

interface ProcessesState {
    list: Process[];
    currentProcess: Process | null;
    formState: Partial<Process>;
}

const initialState: ProcessesState = {
    list: [],
    currentProcess: null,
    formState: {},
};

export const fetchProcesses = createAsyncThunk(
    'processes/fetchProcesses',
    async () => {
        const response = await api.fetchProcesses();
        return response;
    }
);

export const createProcess = createAsyncThunk(
    'processes/createProcess',
    async (process: Omit<Process, 'id'>) => {
        const response = await api.createProcess(process);
        return response;
    }
);

export const updateProcessAsync = createAsyncThunk(
    'processes/updateProcess',
    async (process: Process) => {
        const response = await api.updateProcess(process);
        return response;
    }
);

export const deleteProcessAsync = createAsyncThunk(
    'processes/deleteProcess',
    async (id: string) => {
        await api.deleteProcess(id);
        return id;
    }
);

const processesSlice = createSlice({
    name: 'processes',
    initialState,
    reducers: {
        setProcesses: (state, action: PayloadAction<Process[]>) => {
            state.list = action.payload;
        },
        setCurrentProcess: (state, action: PayloadAction<Process | null>) => {
            state.currentProcess = action.payload;
        },
        updateFormState: (state, action: PayloadAction<Partial<Process>>) => {
            state.formState = { ...state.formState, ...action.payload };
        },
        addProcess: (state, action: PayloadAction<Process>) => {
            state.list.push(action.payload);
        },
        updateProcess: (state, action: PayloadAction<Process>) => {
            const index = state.list.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        deleteProcess: (state, action: PayloadAction<number>) => {
            console.log('Deleting process slice:', action.payload);
            state.list = state.list.filter(p => p.id !== +action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProcesses.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(createProcess.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateProcessAsync.fulfilled, (state, action) => {
                const index = state.list.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteProcessAsync.fulfilled, (state, action) => {
                state.list = state.list.filter(p => p.id !== +action.payload);
            });
    },
});

export const {
    setProcesses,
    setCurrentProcess,
    updateFormState,
    addProcess,
    updateProcess,
    deleteProcess,
} = processesSlice.actions;

export default processesSlice.reducer;