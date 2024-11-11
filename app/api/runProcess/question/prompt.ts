import { PromptConfig } from "@/app/promptType";
import { z } from "zod";


const outputSchema = z.object({
    answer: z.string().nullable().describe("Your answer should be a concise summary of the relevant information found in the provided context, typically 100-200 words. Focus on extracting and presenting key facts and insights that help answer the question. If no relevant information is found, respond with null. Use clear, professional language and organize information logically. Do not include source references, URLs, or titles in the answer. Answer will be a string and a string alone."),
    reasoning: z.string().describe("Explain why you decided to answer the question in this way. "),

});
export type QuestionResponse = z.infer<typeof outputSchema>;
export const prompt: PromptConfig = {
    prompt: "You will act as a sales researcher and provide an answer to the following question: {question}. \n\n You will use the following context to answer the question: {context}. If you do not think there is relevant information in the context, please use the protocol outlined in the another part of the prompt. \n\n Please respond in JSON like so: {format_instructions}",
    schema: outputSchema,
};
