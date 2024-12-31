// v2 with zod schema for structured input
import OpenAI from "openai";
import dotenv from "dotenv";
import { getWeather, tools } from "./utils";
dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);


const messages = [
  {
    role: "system",
    content: `You are a helpful assistant that uses tools to answer user queries. 
       You should try to get weather of the country by calling the tool and then suggest the weather.
      `,
  },
  {
    role: "user",
    content: "Can you recommend clothing for New York?",
  },
];

async function chatStream() {
  let context = [...messages]; // Clone the initial messages to avoid mutation
  let continueChat = true; // Control variable for the loop

  while (continueChat) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: context,
        tools, // Include tools if required by your implementation
        stream: true, // Enable streaming
      });

      let functionArguments = "";
      let functionName = "";
      let isCollectingFunctionArgs = false;
      let toolCallDetected = false;

      // Collect the streamed response parts
      for await (const part of response) {
        const choice = part.choices[0];
        const delta = choice.delta;
        const finishReason = choice.finish_reason;

        // Handle content being streamed
        if (delta.content) {
          process.stdout.write(`Assistant: ${delta.content}`); // Stream the assistant's reply in real-time
        }

        // Detect tool calls in the streamed response
        if (delta.tool_calls) {
          toolCallDetected = true;
          isCollectingFunctionArgs = true;
          const toolCall = delta.tool_calls[0]; // Assuming one tool call per response

          if (toolCall.function?.name) {
            functionName = toolCall.function.name;
            console.log(`\nFunction name: ${functionName}`);
          }

          if (toolCall.function?.arguments) {
            functionArguments += toolCall.function.arguments;
            console.log(`Function arguments: ${functionArguments}`);
          }
        }

        // When the assistant signals that it's waiting for a tool call
        if (finishReason === "tool_calls" && isCollectingFunctionArgs) {
          console.log(`\nFunction call "${functionName}" is complete.`);
          console.log("Function arguments:", functionArguments);

          // Parse the function arguments
          let args;
          try {
            args = JSON.parse(functionArguments);
          } catch (parseError) {
            console.error("Error parsing function arguments:", parseError);
            break; // Exit the loop on parse error
          }

          // Execute the tool call
          const toolResponse = await callTool({
            function: {
              name: functionName,
              arguments: JSON.stringify(args),
            },
          });

          // Create a message for the tool's response
          const functionCallResultMessage = {
            role: "tool",
            content: JSON.stringify(toolResponse),
          };

          // Append the tool's response to the context
          context.push(functionCallResultMessage);

          // Reset variables for the next iteration
          functionArguments = "";
          functionName = "";
          isCollectingFunctionArgs = false;
          toolCallDetected = false;

          // Optionally, print the tool's response
          console.log("Tool Response:", toolResponse);
        }
      }

      // After streaming is complete, check if a final response was provided
      if (!toolCallDetected) {
        continueChat = false; // Exit the loop if no tool call was detected
      }
    } catch (error) {
      console.error("Error during chat:", error);
      continueChat = false; // Exit the loop on error
    }
  }
}


chatStream().catch((error) => console.error("Error:", error));
