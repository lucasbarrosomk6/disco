import { configureStore } from '@reduxjs/toolkit';
import processesReducer from './processesSlice';
import companyListsReducer from './companyListsSlice';
import discoveryReducer from './discoverySlice';
import { Process, CompanyList, Discovery } from './discoAITypes';

const defaultProcesses: Process[] = [
    {
        id:0,
        name:"About the company",
        searchPhrases: ['Comprehensive overview of "${companyName}"',
  'Primary customer demographics of "${companyName}"',
  'How "${companyName}" differentiates itself from competitors',
  'Business model and evolution of "${companyName}"',
  'Financial performance and metrics for "${companyName}"',
  'Recent news and significant developments about "${companyName}"',
  'Which top companies are utilizing "${companyName}"s services?',
  '"${companyName}" target audience demographics',
  '"${companyName}" customer behavior analysis',
  'Creating a retail customer persona for "${companyName}"',
  '"${companyName}" shopper motivations and pain points',
  'Retail customer persona examples for big box stores like "${companyName}"',
],
questions: [  'Who are the primary customers of "${companyName}", and what are their main characteristics?',
    'How does "${companyName}" differentiate itself from its main competitors in the market?',
    'What is the current business model of "${companyName}", and how has it evolved over recent years?',
    'What are the latest financial performance metrics of "${companyName}", including revenue, profit margins, and market share?',
    'What are some significant recent developments or news about "${companyName}"?',
    'Which top companies are utilizing "${companyName}"s services?',
  
    'What are the primary demographics of "${companyName}" customers (age, income, location)?',
    'What are the shopping habits and frequency of "${companyName}" customers?',
    'What challenges or pain points do "${companyName}" customers experience in retail?',
    'What motivates "${companyName}" customers to choose "${companyName}" over other retailers?',
    'How do "${companyName}" customers prefer to engage with the store (in-person, online, mobile app)?',
  ],
        sections: [
            {
                title: "Company Overview",
                prompt: "Provide a comprehensive overview of ${companyName}, including its primary customers, business model, and recent developments."
            },
            {
                title: "Market Position",
                prompt: "Analyze ${companyName}'s market position, including how it differentiates itself from competitors and its financial performance."
            },
            {
                title: "Customer Analysis",
                prompt: "Describe ${companyName}'s target audience, their demographics, shopping habits, and preferences."
            }
        ]
    },
    // ... (update other processes similarly)
];

const defaultCompanyLists: CompanyList[] = [
    {
        id: 1,
        name: "Default Company List",
        companies: ["Walmart"]
    }
];

const defaultDiscoveries: Discovery[] = [
    {
        id: 1,
        processIds: [1],
        companyListId: 1,
        status: "Complete",
        output: "# Default Discovery Output\n\n[Link to Discovery](https://example.com/discovery)\n\nThis is the content of the default discovery output. It includes important findings and insights from the analysis.",
        results: [{ output: `# Default Discovery Output

## Key Findings

- Important insight 1
- Critical observation 2
- Significant trend 3

[Link to Full Discovery Report](https://example.com/discovery)

> This discovery output summarizes the key findings and insights from our comprehensive analysis. It highlights important trends, observations, and potential areas for further investigation.

This is the content of the default discovery output. It includes important findings and insights from the analysis.`, companyName: "Default company name" }]
    }
];

const preloadedState = {
    processes: {
        list: defaultProcesses,
        currentProcess: null,
        formState: {}
    },
    companyLists: {
        list: defaultCompanyLists,
        currentList: null,
        formState: {}
    },
    discovery: {
        list: defaultDiscoveries,
        currentDiscovery: null
    }
};

export const store = configureStore({
    reducer: {
        processes: processesReducer,
        companyLists: companyListsReducer,
        discovery: discoveryReducer,
    },
    preloadedState
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;