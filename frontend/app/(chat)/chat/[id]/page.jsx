import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Chat } from "@/components/main/chat";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { convertToUIMessages } from "@/lib/utils";
import { getChatById } from "@/api/chats";
import { DataStreamHandler } from "@/components/main/data-stream-handler";
import { getMessagesByChatId } from "@/api/messages";
import { ChatHeader } from "@/components/main/structure/chat-header";

export default async function Page(props) {
  const params = await props.params;
  const { id } = params;
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;
  const accessToken = cookieStore.get("accessToken")?.value;
  const projectId = cookieStore.get("projectId")?.value;
  const { data: chat, error } = await getChatById({
    id,
    accessToken,
    projectId,
  });

  const {data: messagesFromDb, error: messageError} = await getMessagesByChatId({
    chatId: id,
    accessToken,
    projectId,
  });
 

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <>
      <ChatHeader chatId={id} selectedModelId={selectedModelId} />
      {error || messageError ? (
        notFound()
      ) : (
        <>
          <Chat
            id={chat._id}
            initialMessages={convertToUIMessages(messagesFromDb)}
            selectedModelId={selectedModelId}
          />
          <DataStreamHandler id={id} />
        </>
      )}
    </>
  );
}
