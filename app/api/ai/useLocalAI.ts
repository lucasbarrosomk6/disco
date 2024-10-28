import { Ollama } from "@langchain/community/llms/ollama";

export const LLama3 = async (prompt: string, isJson: boolean) => {
  console.log("Using LLama3");
  const options = {
    baseUrl: "http://localhost:11434",
    model: "llama3.1-large",
    format: "",
    temperature: 0.2,
  }
  if (isJson) {
    options.format = "json";
  }
  const ollama = new Ollama(options);
  
  const response = await ollama.invoke(prompt);
  return response;
};
