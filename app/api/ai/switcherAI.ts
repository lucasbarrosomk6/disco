import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { useLocalEmbedding } from "./useLocalEmbedding";
import { PromptConfig } from "@/app/promptType";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
dotenv.config();
const getChain = (ollama: Ollama, prompt: PromptTemplate, parser: StructuredOutputParser<any>) => {
  let chain;
  if (process.env.USE_CLOUD === "true") {
    console.log("Using cloud AI")
    const openai = new ChatOpenAI({
      temperature: 0.3,
      model: "gpt-4o-mini",
    });
    chain = prompt.pipe(openai).pipe(parser);
  } else {
    chain = prompt.pipe(ollama).pipe(parser);
  }
  return chain;
}

const ollama = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "llama3.1-large",
  format: "json",
  temperature: 0.2,
});
export const useAI = async (
  promptConfig: PromptConfig,
  variables: Record<string, any>,
) => {

  const parser = StructuredOutputParser.fromZodSchema(promptConfig.schema);

  const prompt = PromptTemplate.fromTemplate(promptConfig.prompt);
  const chain = getChain(ollama, prompt, parser);
  const result = await chain.invoke({ ...variables, format_instructions: parser.getFormatInstructions() + "\n\n" + "Do not include anything other than a json object. DO NOT include things like  (```json) or (```) or anything else. just the json object." });
  return result
};


export const useEmbeddings = async (
  splitDocs: Document<Record<string, any>>[]
) => {
  return await useLocalEmbedding(splitDocs);
  //   return process.env.USE_CLOUD === "true"
  //     ? await cloudEmbeddings(splitDocs)
  //     : await useLocalEmbedding(splitDocs);
};
