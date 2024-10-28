import Bottleneck from "bottleneck";
import * as dotenv from "dotenv";
dotenv.config();
import { ChatOpenAI } from "@langchain/openai";

const limiter = new Bottleneck({
  minTime: 1000, // Ensures at least 1 second between each request
  maxConcurrent: 1, // Ensures only 1 request at a time
  reservoir: 60, // Number of requests allowed per minute
  reservoirRefreshAmount: 60, // Refill rate
  reservoirRefreshInterval: 60 * 1000, // Refill every minute
});

export async function GPT4o(prompt: string) {
  console.log("Using GPT4o");

  const creds = {
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: "2023-03-15-preview",
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  };

  const model = new ChatOpenAI({
    temperature: 0.3,
    ...creds,
  });

  return limiter.schedule(async () => {
    const response = await model.invoke([prompt]);
    const content = response.content as string;
    return content.replace(/```json|```/g, "").trim();
  });
}
