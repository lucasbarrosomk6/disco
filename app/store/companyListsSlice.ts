import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyList } from './discoAITypes';



interface CompanyListsState {
    list: CompanyList[];
    currentList: CompanyList | null;
    formState: Partial<CompanyList>;
}

const initialState: CompanyListsState = {
    list: [],
    currentList: null,
    formState: {},
};

const companyListsSlice = createSlice({
    name: 'companyLists',
    initialState,
    reducers: {
        setCompanyLists: (state, action: PayloadAction<CompanyList[]>) => {
            state.list = action.payload;
        },
        setCurrentList: (state, action: PayloadAction<CompanyList | null>) => {
            state.currentList = action.payload;
        },
        updateFormState: (state, action: PayloadAction<Partial<CompanyList>>) => {
            state.formState = { ...state.formState, ...action.payload };
        },
        addCompanyList: (state, action: PayloadAction<CompanyList>) => {
            state.list.push(action.payload);
        },
        updateCompanyList: (state, action: PayloadAction<CompanyList>) => {
            const index = state.list.findIndex(l => l.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        deleteCompanyList: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(l => l.id !== action.payload);
        },
    },
});

export const {
    setCompanyLists,
    setCurrentList,
    updateFormState,
    addCompanyList,
    updateCompanyList,
    deleteCompanyList,
} = companyListsSlice.actions;

export default companyListsSlice.reducer;