import { Process } from "../store/discoAITypes";



// These functions will be replaced with actual API calls in the future
export const fetchProcesses = async (): Promise<Process[]> => {
    // Simulating API call
    return [];
};

export const createProcess = async (process: Omit<Process, 'id'>): Promise<Process> => {
    // Simulating API call
    return { ...process, id: Date.now() };
};

export const updateProcess = async (process: Process): Promise<Process> => {
    // Simulating API call
    return process;
};

export const deleteProcess = async (id: string): Promise<void> => {
    // Simulating API call
};