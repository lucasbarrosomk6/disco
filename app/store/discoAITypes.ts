export interface Process {
    id?: number
    name: string
    searchPhrases: string[]
    questions: string[]
    sections: { title: string; prompt: string }[]
}

export interface Section {
    title: string;
    content?: string;
    prompt: string;

    sources?: Source[];
}

export interface CompanyList {
    id: number
    name: string,
    companies: string[]
}

export interface Discovery {
    id: number
    processIds: number[]
    companyListId: number
    status: string
    output: string
    results: { output: string; companyName: string }[]
}
export interface Source {
    id: number
    url: string
    title: string
    explanation?: string
}