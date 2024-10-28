import { Process, Section, Source } from "@/app/store/discoAITypes";
import { fetchFullTextsConcurrently, scrapeConcurrently } from "../scrape/scrapeUtils";
import { createEmbeddingsLangchain } from "../ai/useLocalEmbedding";
import { useAI } from "../ai/switcherAI";

export const processCompany = async (companyName: string, process: Process): Promise<{
    sections: Section[];
    questionResponses: { answer: string; sources: Source[]; question: string }[];
}> => {
    console.log(`Processing company: ${companyName}`);
    const { searchPhrases, questions, sections } = process;
    const replaceWithCompanyName = (texts: string[]) => {
        return texts.map(text => text.replace(/\${companyName}/g, companyName))
    }
    const searchPhrasesWithCompanyName = replaceWithCompanyName(process.searchPhrases)
    const questionsWithCompanyName = replaceWithCompanyName(process.questions)
    const searchResults = await scrapeConcurrently(searchPhrasesWithCompanyName)
    const resultsMap = await fetchFullTextsConcurrently(searchResults);
    const embeddings = await createEmbeddingsLangchain(resultsMap);
    const questionResponses: { answer: string; sources: Source[]; question: string }[] = [];

    for (let question of questionsWithCompanyName) {
        const relevantDocs = await embeddings.similaritySearchWithScore(question);
        const summaryPrompt = `Act as a sales researcher and provide an answer to the following question:"${question}" using this context as a reference:{${
            relevantDocs.map(([doc]) => doc.pageContent).join("\n\n")
        }}".
        
        please respond in json like so:
        {
          "answer": string //your answer to the question. If you believe that there is not a sufficient answer to the question, respond with "null" the answer will be complete, concise, and easy to understand. you will respond as a complete string.
          "reasoning": string //explain why you wrote this answer.
        }
        `;

        const response = await useAI(summaryPrompt);
        const parsedResponse = JSON.parse(response);

        if (parsedResponse.answer !== null && !parsedResponse.answer.includes("null")) {
            questionResponses.push({
                answer: parsedResponse.answer,
                question: question,
                sources: [...new Set(relevantDocs.map(([doc]) => ({id: doc.metadata.id, url: doc.metadata.url, title: doc.metadata.title})))],
            });
        }
    }

    const sectionResults = [];
    for (const section of sections) {
        const sectionPrompt = `Act as a sales researcher and provide an answer to the following question: "${section.prompt.replace(/\${companyName}/g, companyName)}" using this context as a reference:{${questionResponses.map(response => response.question + "\n\n" + response.answer + "\n\n" + response.sources.map(source => `- ${source.title}, source id: ${source.id} `).join("\n\n")).join("\n\n")}}

        please respond in json like so:
        {
          "answer": string //your answer to the question in 200-400 words. If you believe that there is not a sufficient answer to the question, respond with "null" please format your response in markdown, using the following guidelines:
          - Use ### for main headings
          - Use #### for subheadings
          - Use - for bullet points (do not use *)
          - Use numbered lists for sequential information
          - Add a blank line between sections for improved readability
          Do not include a source list here, that is for the source ids.
          "reasoning": string //explain why you wrote this answer.
          "sourceIds": {
             id:number, 
             explanation: string //a brief and concise explanation of why you used this source and what to look for to double check the answer you gave.
           }[] //the ids of the sources that you used to answer the question.
        }
        `;

        const sectionAnswer = await useAI(sectionPrompt);
        const parsedSectionAnswer: { answer: string; reasoning: string; sourceIds: { id: number; explanation: string }[] } = JSON.parse(sectionAnswer);

        const allSources = questionResponses.flatMap(response => response.sources);
        const sectionSources = allSources.reduce((acc: Source[], curr: Source) => {
            if (!acc.some(source => source.id === curr.id) && parsedSectionAnswer.sourceIds.some(sourceId => sourceId.id === curr.id)) {
                acc.push({ ...curr, explanation: parsedSectionAnswer.sourceIds.find(sourceId => sourceId.id === curr.id)?.explanation });
            }
            return acc;
        }, []);

        sectionResults.push({
            title: section.title,
            content: parsedSectionAnswer.answer,
            sources: sectionSources,
            prompt: section.prompt
        });
    }

    return {
        sections: sectionResults,
        questionResponses
    };
};