import { processQuestionsPrompt } from "@/prompts/brainstorm/processQuestions";
import { useAI } from "../../ai/switcherAI";
import { PromptConfig } from "@/app/promptType";
import { Document } from "langchain/document";

import { prompt as questionPrompt, QuestionResponse as QuestionPromptResponse } from "./prompt";
import { QuestionResponse } from "../processCompany";

export const processQuestion = async (question: string, questionPrompt: PromptConfig, embeddings: any) => {
    const relevantDocs: [Document, number][] = await embeddings.similaritySearchWithScore("search_query: " + question);

    const response = await useAI(questionPrompt, {
        question, context: relevantDocs
            .map(([doc]) => doc.pageContent)
            .join("\n\n")
    });
    let questionResponse: QuestionResponse | null = null;
    if (response.answer && !response.answer.includes("null")) {
        questionResponse = {
            answer: response.answer,
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
        };
    }

    return { questionResponse };
}
export async function processQuestions(
    questions: string[],
    embeddings: any,
    updateStatus: (status: string) => void
): Promise<QuestionResponse[]> {
    const questionResponses: QuestionResponse[] = [];
    for (let question of questions) {
        updateStatus(`Answering question: ${questions.indexOf(question) + 1}/${questions.length}`);
        const { questionResponse } = await processQuestion(question, questionPrompt, embeddings);
        if (questionResponse) {
            questionResponses.push(questionResponse);
        }
    }
    return questionResponses;
}