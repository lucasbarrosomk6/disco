import { Process, Section, Source } from "@/app/store/discoAITypes";
import { fetchFullTextsConcurrently, scrapeConcurrently } from "../scrape/scrapeUtils";
import { createEmbeddingsLangchain } from "../ai/useLocalEmbedding";
import { useAI } from "../ai/switcherAI";
import { Document } from "langchain/document";

// Type definitions for clarity
type ResultsMapType = any; // Replace with actual type if available
type EmbeddingsType = any; // Replace with actual type if available

type QuestionResponse = {
    answer: string;
    sources: Source[];
    question: string;
};

type SectionResult = {
    title: string;
    content: string;
    sources: Source[];
    prompt: string;
};

// Function to replace placeholders in texts
function replacePlaceholders(texts: string[], placeholders: Record<string, string>): string[] {
    return texts.map(text => {
        for (const [key, value] of Object.entries(placeholders)) {
            text = text.replace(new RegExp(`\\\${${key}}`, 'g'), value);
        }
        return text;
    });
}

// Function to prepare the process by replacing placeholders
function prepareProcess(companyName: string, process: Process): Process {
    const placeholders = { companyName };
    const searchPhrases = replacePlaceholders(process.searchPhrases, placeholders);
    const questions = replacePlaceholders(process.questions, placeholders);
    const sections = process.sections.map(section => ({
        ...section,
        prompt: section.prompt.replace(/\${companyName}/g, companyName),
    }));
    return { name: process.name, searchPhrases, questions, sections };
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
async function processQuestions(
    questions: string[],
    embeddings: EmbeddingsType,
    updateStatus: (status: string) => void
): Promise<QuestionResponse[]> {
    const questionResponses: QuestionResponse[] = [];
    for (let question of questions) {
        updateStatus(`Answering question: ${questions.indexOf(question) + 1}/${questions.length}`);
        const relevantDocs: [Document, number][] = await embeddings.similaritySearchWithScore("search_query: " + question);
        const summaryPrompt = `Act as a sales researcher and provide an answer to the following question:"${question}" using this context as a reference:{${relevantDocs
            .map(([doc]) => doc.pageContent)
            .join("\n\n")}}".
      
Please respond in JSON like so:
{
  "answer": string, // Your answer to the question. If insufficient data, respond with "null".
  "reasoning": string // Explain why you wrote this answer.
}
`;
        const response = await useAI(summaryPrompt);
        const parsedResponse = JSON.parse(response);

        if (parsedResponse.answer && !parsedResponse.answer.includes("null")) {
            questionResponses.push({
                answer: parsedResponse.answer,
                question,
                sources: [
                    ...new Set(
                        relevantDocs.map(([doc]) => ({
                            id: doc.metadata.id,
                            url: doc.metadata.url,
                            title: doc.metadata.title,
                        }))
                    ),
                ],
            });
        }
    }
    return questionResponses;
}

// Function to process sections
async function processSections(
    sections: Section[],
    questionResponses: QuestionResponse[],
    updateStatus: (status: string) => void
): Promise<SectionResult[]> {
    const sectionResults: SectionResult[] = [];
    for (const section of sections) {
        updateStatus(`Generating section: ${section.title}`);
        const sectionPrompt = `Act as a sales researcher and provide an answer to the following question: "${section.prompt}" using this context as a reference:{${questionResponses
            .map(
                response =>
                    `${response.question}\n\n${response.answer}\n\n${response.sources
                        .map(source => `- ${source.title}, source id: ${source.id}`)
                        .join("\n\n")}`
            )
            .join("\n\n")}}

Please respond in JSON like so:
{
  "answer": string, // Your answer in 200-400 words, Remember to use full markdown formatting, take advantage of new lines, bullet points, tables and any other markdown features. Do not include references to the sources in the answer. Do not include sources in the answer.
  "reasoning": string, // Explain why you wrote this answer.
  "sourceIds": [
    {
      "id": number,
      "explanation": string // Brief explanation for using this source.
    }
  ] // The IDs of the sources used.
}
`;
        const sectionAnswer = await useAI(sectionPrompt);
        const parsedSectionAnswer = JSON.parse(sectionAnswer);
        console.log(sectionAnswer)
        const allSources = questionResponses.flatMap(response => response.sources);
        const sectionSources = allSources.reduce((acc: Source[], curr: Source) => {
            if (
                !acc?.some(source => source.id === curr.id) &&
                parsedSectionAnswer?.sourceIds?.some((sourceId: any) => sourceId.id === curr.id)
            ) {
                acc.push({
                    ...curr,
                    explanation: parsedSectionAnswer.sourceIds.find(
                        (sourceId: any) => sourceId.id === curr.id
                    )?.explanation,
                });
            }
            return acc;
        }, []);

        sectionResults.push({
            title: section.title,
            content: parsedSectionAnswer.answer,
            sources: sectionSources,
            prompt: section.prompt,
        });
    }
    return sectionResults;
}

// Main function to process the company
export const processCompany = async (
    companyName: string,
    process: Process,
    updateStatus: (status: string) => void
): Promise<{
    sections: SectionResult[];
    questionResponses: QuestionResponse[];
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
    const questionResponses = await processQuestions(preparedProcess.questions, embeddings, updateStatus);
    const sectionResults = await processSections(preparedProcess.sections, questionResponses, updateStatus);

    return {
        sections: sectionResults,
        questionResponses,
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
