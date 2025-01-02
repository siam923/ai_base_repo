import { z } from "zod";
import { createDocSchema, weatherParamSchema } from "./schemas.js";
import { getWeather, createDocumentTool } from "./tools.js";

const blocksTools = [
  "createDocument",
  //   "updateDocument",
];

const weatherTools = ["getWeather"];

const allTools = [...blocksTools, ...weatherTools];

const weatherToolDef = {
  getWeather: {
    description: "Get the current weather at a location'",
    parameters: weatherParamSchema,
    execute: getWeather,
  },
};

const blocksToolsDef = (dataStream, context) => ({
  createDocument: {
    description:
      "Create a document for a writing activity. This tool will call other functions that will generate the contents of the document based on the title and kind.",
    parameters: createDocSchema,
    execute: async ({ title, kind }) => {
      const result =  await createDocumentTool({ title, kind, dataStream, context });
      return result;
    },
  },
});

export { blocksTools, weatherTools, allTools, weatherToolDef, blocksToolsDef };
