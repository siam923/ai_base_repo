"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { fetcher, getLocalStorage } from "@/lib/utils";
import { BASE_URL } from "@/data/api-handler";
import { MultimodalInput } from "./forms/multimodal-input";
import { ChatHeader } from "./structure/chat-header";
import { Messages } from "./messages";

// import { Block } from './block';
// import { VisibilityType } from './visibility-selector';
// import { useBlockSelector } from '@/hooks/use-block';

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
}) {
  console.log("id", id);
  const { mutate } = useSWRConfig();
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    api: `${BASE_URL}/api/chat/send`,
    headers: { 
      "accesstoken": getLocalStorage("accessToken"),
      "x-project-id": getLocalStorage("projectId")
     },
    id,
    body: { id, modelId: selectedModelId },
    initialMessages,
    experimental_throttle: 100,
    onFinish: () => {
      mutate(`${BASE_URL}/api/history`); // Invalidate history cache
    },
  });

  //   const isBlockVisible = useBlockSelector((state) => state.isVisible);

  return (
    <>
      <div className="flex flex-col min-w-0 h-[90dvh] mt-5 bg-background">
        <Messages
          chatId={id}
          isLoading={isLoading}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          // isBlockVisible={isBlockVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          }
        </form>
      </div>

      {/* <Block
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
        /> */}
    </>
  );
}
