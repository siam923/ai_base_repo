import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

dotenv.config();

let messages = [
    new AIMessage("So you said you were researching ocean mammals?", {name:"Model"}),
    new HumanMessage("Yes, that's right.", {name:"Siam"}),
    new AIMessage("Great, what would you like to learn about.", {name:"Model"}),
    new HumanMessage("I would like to know about the best place to see Orcas in us.", {name:"Siam"}),
]

// for (let message of messages) {
//     message.pretty_print();
// }

const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
})

//Invoke returns AIMessage{content, id, additional_kwargs, response_metadata, finish_reason, usage..
const result  = await llm.invoke(messages)
console.log(result)