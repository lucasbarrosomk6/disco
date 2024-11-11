import { Process, Section, Source } from "@/app/store/discoAITypes";
import { fetchFullTextsConcurrently, scrapeConcurrently } from "../scrape/scrapeUtils";
import { createEmbeddingsLangchain } from "../ai/useLocalEmbedding";
import { useAI } from "../ai/switcherAI";
import { Document } from "langchain/document";
import { prompt as sectionPrompt, SectionResponse } from "./section/prompt";
import { prompt as questionPrompt, QuestionResponse as QuestionPromptResponse } from "./question/prompt";
import { getSources } from "./utils/getSources";
import { replacePlaceholders } from "./utils/replacePlaceholders";
import { processQuestion, processQuestions } from "./question/processQuestion";
import { processSections, SectionResult } from "./section/processSection";

// Type definitions for clarity
type ResultsMapType = any; // Replace with actual type if available
type EmbeddingsType = any; // Replace with actual type if available

export type QuestionResponse = {
    answer: string;
    sources: Source[];
    question: string;
};





// Function to prepare the process by replacing placeholders
function prepareProcess(companyName: string, process: Process): Process {
    const placeholders = { companyName };
    const searchPhrases = replacePlaceholders(process.searchPhrases, placeholders);

    const sections = process.sections.map(section => ({
        ...section,
        prompt: section.prompt.replace(/\${companyName}/g, companyName),
        questions: section.questions.map(question => question.replace(/\${companyName}/g, companyName)),
        title: section.title.replace(/\${companyName}/g, companyName),

    }));
    return { name: process.name, searchPhrases, sections };
}

// Function to get search results
async function getSearchResults(searchPhrases: string[]): Promise<ResultsMapType> {
    const searchResults = await scrapeConcurrently(searchPhrases);
    const resultsMap = await fetchFullTextsConcurrently(searchResults);
    return resultsMap;
}

// Function to create embeddings
async function getEmbeddings(resultsMap: ResultsMapType): Promise<EmbeddingsType> {
    const embeddings = await createEmbeddingsLangchain(resultsMap);
    return embeddings;
}

// Function to process questions and generate responses


// Function to process sections


// Main function to process the company
export const processCompany = async (
    companyName: string, process: Process, updateStatus: (status: string) => void): Promise<{
        sections: SectionResult[];

    }> => {
    console.log(`Processing company: ${companyName}`);


    // Prepare the process by replacing placeholders
    const preparedProcess = prepareProcess(companyName, process);
    updateStatus("Gathering possible sources")
    // Get search results and embeddings
    const resultsMap = await getSearchResults(preparedProcess.searchPhrases);
    updateStatus("Giving our ai the sources")
    const embeddings = await getEmbeddings(resultsMap);

    // Process questions and sections
    updateStatus("Picking the sources Relevant to you")

    const sectionResults = await processSections(preparedProcess.sections, embeddings, updateStatus);

    return {
        sections: sectionResults,
    };
};

// Exporting individual functions for modular use
export {
    prepareProcess,
    getSearchResults,
    getEmbeddings,
    processQuestions,
    processSections,
};
