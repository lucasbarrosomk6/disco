import { QuestionResponse } from "../processCompany";
import { Source } from "@/app/store/discoAITypes";
import { SectionResponse } from "../section/prompt";

export const getSources = (questionResponses: QuestionResponse[], parsedSectionAnswer: SectionResponse) => {
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
    return sectionSources;
}