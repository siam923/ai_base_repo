import { z } from "zod";

 export const weatherParamSchema = z.object({
    location: z.string().describe('The location to get the weather for'),
  });


  export const createDocSchema = z.object({
    title: z.string(),
    kind: z.enum(["text", "code"]),
  })

  export const updateDocSchema = z.object({
    id: z.string().describe('The ID of the document to update'),
    description: z
      .string()
      .describe('The description of changes that need to be made'),
  })

  export const suggestionInputSchema =  z.object({
    documentId: z
      .string()
      .describe('The ID of the document to request edits'),
  })

  export const suggestionAiGenSchema = z.object({
    originalSentence: z
      .string()
      .describe('The original sentence'),
    suggestedSentence: z
      .string()
      .describe('The suggested sentence'),
    description: z
      .string()
      .describe('The description of the suggestion'),
  })