import * as dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";

async function main() {
  const creds = {
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: "2023-03-15-preview",
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  };
  console.log(creds);
  const model = new ChatOpenAI({
    temperature: 0.9,
    ...creds,
  });

  const response = await model.invoke([
    {
      role: "system",
      content:
        "please answer in json format:{randomAnimal: string, randomFruit: string}",
    },
  ]);

  console.log(JSON.parse(response.content as string).randomFruit);
}

main().catch(console.error);
