import { generateText, streamText } from "ai";
import { customModel } from "#src/lib/ai/index.js";

async function generateTitleFromUserMessage({ message }) {
  const { text: title } = await generateText({
    model: customModel("gpt-4o-mini"),
    system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}


const streamAIResponse = ({model, system, coreMessages, dataStream, tools, active_tools, onFinishCallback}) => {
  const result = streamText({
    model: customModel(model.apiIdentifier),
    system,
    messages: coreMessages,
    maxSteps: 5,
    experimental_activeTools: active_tools,
    tools,
    onFinish: onFinishCallback,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });
  result.mergeIntoDataStream(dataStream);
};



export { generateTitleFromUserMessage, streamAIResponse };