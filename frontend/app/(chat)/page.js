import { cookies } from "next/headers";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { Chat } from "@/components/main/chat";
import { DataStreamHandler } from "@/components/main/data-stream-handler";
import { ChatHeader } from "@/components/main/structure/chat-header";
// import { DataStreamHandler } from '@/components/data-stream-handler';

export default async function Page() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <>
      <ChatHeader selectedModelId={selectedModelId} />
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedModelId={selectedModelId}
        selectedVisibilityType="private"
      />
      <DataStreamHandler id={id} />
    </>
  );
}
