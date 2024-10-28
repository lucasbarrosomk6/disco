import * as dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { AzureOpenAIEmbeddings } from "@langchain/openai";
export async function cloudEmbeddings(
  splitDocs: Document<Record<string, any>>[]
) {
  console.log("Using cloud embeddings");
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    new AzureOpenAIEmbeddings({
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
      azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
      azureOpenAIApiEmbeddingsDeploymentName:
        process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
      azureOpenAIApiVersion: "2", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
      maxRetries: 1,
    })
  );
  return vectorStore;
}
