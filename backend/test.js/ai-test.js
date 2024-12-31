import { truncateHalfConversation } from "#src/utils/ai/slidingWindow.js";

const messages = [
  { role: "user", content: "Task details." },
  { role: "user", content: "Explain AI." },
  { role: "assistant", content: "AI stands for artificial intelligence..." },
  { role: "user", content: "What is ML?" },
  { role: "assistant", content: "ML refers to machine learning..." },
  { role: "user", content: "Give an example." },
  { role: "assistant", content: "Image recognition is an example..." },
];

const truncatedMessages = truncateHalfConversation(messages);
console.log(truncatedMessages);
