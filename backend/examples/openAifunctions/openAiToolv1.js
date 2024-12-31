import OpenAI from "openai";
import dotenv from "dotenv";
import { callTool, getWeather, suggestClothing, tools } from "./utils.js";

dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant that uses tools to answer user queries.",
  },
  {
    role: "user",
    content: "Can you recommend clothing for New York?",
  },
];

async function chat() {
  let context = [...messages];

  while (true) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: context,
        tools, // Ensure 'tools' is correctly defined or remove if not needed
      });

      const message = response.choices[0].message;
      context.push(message);

      console.log("API Response:", JSON.stringify(response, null, 2));

      const toolCalls = message.tool_calls;

      if (toolCalls && toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          // Execute each tool call
          const callerResponse = await callTool(toolCall);

          // Create a message for the tool's response
          const functionCallResultMessage = {
            role: "tool",
            content: JSON.stringify(callerResponse),
            tool_call_id: toolCall.id,
          };

          // Append the tool's response to the context
          context.push(functionCallResultMessage);
        }
        // Continue the loop to handle the next assistant message
      } else {
        // No more tool calls; final response received
        const finalMessage = message.content;
        console.log("AI:", finalMessage);
        break; // Exit the loop
      }
    } catch (error) {
      console.error("Error during chat:", error);
      break; // Exit the loop on error
    }
  }
}

chat().catch((error) => console.error("Error:", error));
