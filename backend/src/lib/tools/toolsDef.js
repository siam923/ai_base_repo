import { createDocSchema, weatherParamSchema } from "./schemas.js";
import { getWeather, createDoc } from "./tools.js";

const blocksTools = [
  "createDocument",
  "updateDocument",
  "requestSuggestions",
];

const weatherTools = ['getWeather'];

const allTools = [...blocksTools, ...weatherTools];

const weatherToolDef = {
    getWeather: {
        description: "Get the current weather at a location'",
        parameters: weatherParamSchema,
        execute: getWeather
    },
} 

const blockToolsDef = {
    createDocument: {
        description:'Create a document for a writing activity. This tool will call other functions that will generate the contents of the document based on the title and kind.',
        paramerters: createDocSchema,
        execute: createDoc
    }
}


export {
    blocksTools,
    weatherTools,
    allTools,
    weatherToolDef
}