
import { useAI, useEmbeddings } from "@/app/api/ai/switcherAI";
import { Document } from "langchain/document";
import { NextRequest, NextResponse } from "next/server";
const questions = [
    {
        variable: "productName",
        question: "What is the name of the product?"
    },
    {
        variable: "tagline",
        question: "What is the tagline or slogan that best describes the product’s value proposition?"
    },
    {
        variable: "targetAudience",
        question: "Who is the primary target audience or intended user group for this product?"
    },
    {
        variable: "mainUseCase",
        question: "What is the main use case or primary application of this product as described in the document?"
    },
    {
        variable: "keyFeatures",
        question: "What are the key features of the product? List the main functionalities or unique attributes highlighted."
    },
    {
        variable: "problemsSolved",
        question: "What specific problems or pain points does this product aim to solve for its users?"
    },
    {
        variable: "differentiators",
        question: "How does this product differentiate itself from competitors, or what unique selling points does it offer?"
    },
    {
        variable: "successMetrics",
        question: "What metrics or indicators of success are used to measure the effectiveness of this product?"
    }
];
export async function POST(req: NextRequest) {
    const documents = await req.json();
    const embeddings = await useEmbeddings(documents[0]);

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
        for (const question of questions) {
            const needsToBeAnArray = question.variable === "keyFeatures";
            const context = (
                await embeddings.similaritySearchWithScore(question.question, 2)
            ).filter((doc) => doc[1] > 0.5);

            const contextForPrompt = context
                .map((doc) => doc[0].pageContent)
                .join("\n");
            if (!context.length) {
                continue;
            }

            const prompt = `you are a product researcher, your job is to use the context that will be provided to answer a question.
        question: ${question.question}
        context: ${contextForPrompt}
        you will respond in json format, 
        {
        answer: ${needsToBeAnArray ? `string[]` : `string`}
        reasoning: string //explain your reasoning for the answer you gave
        quote: string //a quote from the context that supports the answer you gave
        }
        `;

            const answer = await useAI(prompt);
            console.log(question.variable, answer);
            try {
                const json = JSON.parse(answer) as { answer: string | string[] };
                const data = {
                    variable: question.variable,
                    answer: json.answer,
                };
                const jsonString = JSON.stringify(data);
                await writer.write(new TextEncoder().encode(jsonString + "\n"));
            } catch (err) {
                console.log(err);
                const data = {
                    variable: question.variable,
                    answer: needsToBeAnArray ? [] : "",
                };
                const jsonString = JSON.stringify(data);
                await writer.write(new TextEncoder().encode(jsonString + "\n"));
            }
        }

        await writer.close();
    })();

    return new NextResponse(readable, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}