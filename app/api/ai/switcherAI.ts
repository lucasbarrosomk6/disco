import * as dotenv from "dotenv";
import { GPT4o } from "./useCloudAI";
import { LLama3 } from "./useLocalAI";
import { Document } from "langchain/document";
import { useLocalEmbedding } from "./useLocalEmbedding";
dotenv.config();

export const useAI = async (
  prompt: string,
  cloudOverride = false,
  isJson = true
): Promise<string> => {
  return process.env.USE_CLOUD === "true" || cloudOverride
    ? await GPT4o(prompt)
    : await LLama3(prompt, isJson);
};

export const useEmbeddings = async (
  splitDocs: Document<Record<string, any>>[]
) => {
  return await useLocalEmbedding(splitDocs);
  //   return process.env.USE_CLOUD === "true"
  //     ? await cloudEmbeddings(splitDocs)
  //     : await useLocalEmbedding(splitDocs);
};
