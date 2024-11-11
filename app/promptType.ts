import { z } from "zod";

export interface PromptConfig {
    prompt: string;
    schema: z.ZodSchema;
}