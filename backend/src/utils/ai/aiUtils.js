export function sanitizeResponseMessages(messages) {
  const toolResultIds = [];

  // Collect all toolResultIds from 'tool' messages
  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  // Map messages to sanitize 'assistant' messages
  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (typeof message.content === "string") return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === "tool-call"
        ? toolResultIds.includes(content.toolCallId)
        : content.type === "text"
        ? content.text.length > 0
        : true
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  // Filter out messages with empty content
  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0
  );
}

export function getMostRecentUserMessage(messages) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(documents, index) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}


export function getMessageIdFromAnnotations(message) {
    if (!message.annotations) return message.id;
  
    const [annotation] = message.annotations;
    if (!annotation) return message.id;
  
    return annotation.messageIdFromServer;
  }
  