import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { useEmbeddings } from "./switcherAI";
export const createEmbeddingsLangchain = async (
  textsMap: Map<string, { text: string; url: string; title: string }[]>
) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 10,
  });
  const splitDocs: Document<Record<string, any>>[] = [];
  let sourceId = 0;
  for (const [key, value] of textsMap.entries()) {
    for (const source of value) {
      sourceId++;
      const splitTextArray = await splitter.splitText(source.text);
      for (const splitText of splitTextArray) {
        splitDocs.push(
          new Document({
            pageContent: "search_document: " + splitText,
            metadata: { url: source.url, title: source.title, id: sourceId },
          })
        );
      }
    }
  }

  const vectorStore = useEmbeddings(splitDocs);

  return vectorStore;
};
export const useLocalEmbedding = async (
  splitDocs: Document<Record<string, any>>[]
) => {
  console.log("Using local embeddings");
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    new OllamaEmbeddings({
      model: "nomic-embed-text", // default value
      baseUrl: "http://localhost:11434", // default value
    })
  );
  return vectorStore;
};
