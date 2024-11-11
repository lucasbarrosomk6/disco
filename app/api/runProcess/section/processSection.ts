import { PromptConfig } from "@/app/promptType";
import { useAI } from "../../ai/switcherAI";
import { processQuestions } from "../processCompany";
import { Section, Source } from "@/app/store/discoAITypes";
import { SectionResponse } from "./prompt";
import { getSources } from "../utils/getSources";
import { prompt as sectionPrompt } from "./prompt";
export type SectionResult = {
    title: string;
    content: string;
    sources: Source[];
    prompt: string;
};
export const processSection = async (section: Section, sectionPrompt: PromptConfig, embeddings: any, updateStatus: (status: string) => void) => {
    const questionResponses = await processQuestions(section.questions, embeddings, updateStatus);
    const context = questionResponses
        .map(
            response =>
                `${response.question}\n\n${response.answer}\n\n${response.sources
                    .map(source => `- ${source.title}, source id: ${source.id}`)
                    .join("\n\n")}`
        )
        .join("\n\n")
    const sectionAnswer: SectionResponse = await useAI(sectionPrompt, { context, sectionPrompt: section.prompt });
    const sectionSources = getSources(questionResponses, sectionAnswer);

    return {
        title: section.title,
        content: sectionAnswer.answer,
        sources: sectionSources,
        prompt: section.prompt,
    };

}
export const processSections = async (sections: Section[], embeddings: any, updateStatus: (status: string) => void) => {
    const sectionResults: SectionResult[] = [];
    for (const section of sections) {
        updateStatus(`Processing section: ${sections.indexOf(section) + 1}/${sections.length}`);
        const sectionResult = await processSection(section, sectionPrompt, embeddings, updateStatus);
        sectionResults.push(sectionResult);
    }
    return sectionResults;
}