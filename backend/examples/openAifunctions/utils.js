import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

// Mock weather function
async function getWeather({ location }) {
  return {
    weather: "sunny",
    temperature: 25,
  };
}

// Mock clothing suggestion function
async function suggestClothing({ weather }) {
  return {
    clothing: "light t-shirt and shorts",
  };
}

// Tools list as per OpenAI's function-calling spec
const tools = [
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "Fetches weather data for a location.",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "City name" },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggestClothing",
      description: "Recommends clothing based on weather.",
      parameters: {
        type: "object",
        properties: {
          weather: { type: "string", description: "Weather description" },
        },
        required: ["weather"],
      },
    },
  },
];

// tools with schema validation
// Tools list as per OpenAI's function-calling spec
const weatherParameters = z.object({
  location: z.string().describe("City name to get weather for"),
});

const clothingParameters = z.object({
  weather: z.string().describe("Weather description"),
});

const strictTools = [
  zodFunction({
    name: "getWeather",
    parameters: weatherParameters,
  }),
  zodFunction({
    name: "suggestClothing",
    parameters: clothingParameters,
  }),
];

const callTool = async (toolCall) => {
  switch (toolCall.function.name) {
    case "getWeather":
      const { location } = toolCall.function.arguments;
      const weatherRes = await getWeather({ location });
      return weatherRes;
    case "suggestClothing":
      const { weather } = toolCall.function.arguments;
      const clothRes = await suggestClothing({ weather });
      return clothRes;
    default:
      return {
        error: "Invalid function",
      };
  }
};

export { getWeather, suggestClothing, tools, strictTools, callTool };
