import { weatherParamSchema } from "./schemas.js";
import { getWeather } from "./tools.js";

const blocksTools = [
  "createDocument",
  "updateDocument",
  "requestSuggestions",
];

const weatherTools = ['getWeather'];

const allTools = [...blocksTools, ...weatherTools];

const weatherToolDef = {
    getWeather: {
        title: "Get the current weather at a location'",
        parameters: weatherParamSchema,
        execute: getWeather
    },
} 


export {
    blocksTools,
    weatherTools,
    allTools,
    weatherToolDef
}