import { models } from "#src/lib/ai/models.js";
import { customModel } from "#src/lib/ai/index.js";
import { generateUUID } from "#src/utils/dbUtils.js";
import {
  allTools,
  blocksToolsDef,
  weatherToolDef,
  weatherTools,
} from "#src/lib/tools/toolsDef.js";
import { generateTitleFromUserMessage } from "#src/services/aiService.js";
import { createChat, getChatById } from "#src/services/chatService.js";
import {
  createMessage,
  createMultipleMessages,
  getMessageById,
} from "#src/services/messageService.js";
import {
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "#src/utils/ai/aiUtils.js";
import {
  convertToCoreMessages,
  pipeDataStreamToResponse,
  streamText,
} from "ai";
import { systemPrompt } from "#src/lib/ai/prompts.js";
import { z } from "zod";

export const postChat = async (req, res) => {
  // return res.json({tools: {
  //   ...weatherToolDef,
  //   ...blocksToolsDef('siam'),
  // }})
  const { id, messages, modelId = "gpt-4o-mini" } = req.body;

  const userId = req.user?.id.toString();
  if (!userId) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return res.status(400).json({ message: "Invalid model ID" });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return res.status(400).json({ message: "No user message found" });
  }

  let chat = await getChatById(id);

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    chat = await createChat({ id, userId, title });
    // Use the newly created chat ID
  }

  const userMessageId = generateUUID();

  await createMessage({
    ...userMessage,
    id: userMessageId,
    chatId: chat.id,
  });

  const context = {
    chatId: chat._id,
  }

  // Stream the response to the client
  return pipeDataStreamToResponse(res, {
    execute: async (dataStream) => {
      // Send the user message ID to the client
      dataStream.writeData({
        type: "user-message-id",
        content: userMessageId,
      });



      // Stream the AI response
      const result = streamText({
        model: customModel(model.apiIdentifier),
        system: systemPrompt,
        messages: coreMessages,
        maxSteps: 5,
        experimental_activeTools: allTools,
        tools: {
          ...weatherToolDef,
          ...blocksToolsDef(dataStream, context),
        },
        onFinish: async ({ response }) => {
          if (userId) {
            try {
              const responseMessagesWithoutIncompleteToolCalls =
                sanitizeResponseMessages(response.messages);

              await createMultipleMessages({
                messages: responseMessagesWithoutIncompleteToolCalls.map(
                  (message) => {
                    const messageId = generateUUID();
                    if (message.role === "assistant") {
                      dataStream.writeMessageAnnotation({
                        messageIdFromServer: messageId,
                      });
                    }

                    return {
                      id: messageId,
                      chatId: chat.id,
                      role: message.role,
                      content: message.content,
                    };
                  }
                ),
              });
            } catch (error) {
              console.error("Failed to save message:", error);
            }
          }
        },

        experimental_telemetry: {
          isEnabled: true,
          functionId: "stream-text",
        },
      });

      // Merge the AI response stream into the data stream
      result.mergeIntoDataStream(dataStream);
    },
    onError: (error) => {
      // Handle errors and send an error message to the client
      return error instanceof Error ? error.message : String(error);
    },
  });
};
