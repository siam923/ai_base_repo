import { validateUser } from "#src/services/userService.js";
import { getOrCreateChat } from "#src/services/chatService.js";
import {
  processAndSaveUserMessage,
  saveResponseMessages,
} from "#src/services/messageService.js";
import { streamAIResponse } from "#src/services/aiService.js";
import { models } from "#src/lib/ai/models.js";
import { convertToCoreMessages, pipeDataStreamToResponse } from "ai";
import { getMostRecentUserMessage } from "#src/utils/ai/aiUtils.js";
import { weatherToolDef } from "#src/lib/tools/toolsDef.js";

export const weatherChat = async (req, res) => {
  try {
    const { id, messages, modelId = "gpt-4o-mini" } = req.body;

    const userId = validateUser(req);
    const model = models.find((model) => model.id === modelId);
    if (!model) {
      return res.status(400).json({ message: "Invalid model ID" });
    }

    const coreMessages = convertToCoreMessages(messages);
    const userMessage = getMostRecentUserMessage(coreMessages);
    if (!userMessage) {
      return res.status(400).json({ message: "No user message found" });
    }

    const chat = await getOrCreateChat(id, userId, userMessage);
    const userMessageId = await processAndSaveUserMessage(
      userMessage,
      chat._id
    );

    return pipeDataStreamToResponse(res, {
      execute: async (dataStream) => {
        dataStream.writeData({
          type: "user-message-id",
          content: userMessageId,
        });

        streamAIResponse({
          model,
          system: `You are a helpful assistant, you can help user to get weather data.`,
          coreMessages,
          dataStream,
          tools: {
            ...weatherToolDef,
          },
          active_tools: ['getWeather'],
          onFinishCallback: async ({ response }) => {
            if (userId) {
              try {
                await saveResponseMessages(
                  response.messages,
                  chat._id,
                  dataStream
                );
              } catch (error) {
                console.error("Failed to save messages:", error);
              }
            }
          },
        });
      },
      onError: (error) => {
        return error instanceof Error ? error.message : String(error);
      },
    });
  } catch (error) {
    console.error("Error in postChat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
