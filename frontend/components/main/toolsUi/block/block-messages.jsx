import { PreviewMessage } from '@/components/main/message';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { memo } from 'react';


// interface BlockMessagesProps {
//   chatId: string;
//   isLoading: boolean;
//   messages: Array<Message>;
//   setMessages: (
//     messages: Message[] | ((messages: Message[]) => Message[]),
//   ) => void;
//   reload: (
//     chatRequestOptions?: ChatRequestOptions,
//   ) => Promise<string | null | undefined>;
//   blockStatus: UIBlock['status'];
// }

function PureBlockMessages({
  chatId,
  isLoading,
  messages,
  setMessages,
  reload,
}) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col gap-4 h-full items-center overflow-y-scroll px-4 pt-20"
    >
      {messages.map((message, index) => (
        <PreviewMessage
          chatId={chatId}
          key={message.id}
          message={message}
          isLoading={isLoading && index === messages.length - 1}
          setMessages={setMessages}
          reload={reload}
        />
      ))}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

function areEqual(
  prevProps ,
  nextProps,
) {
  if (
    prevProps.blockStatus === 'streaming' &&
    nextProps.blockStatus === 'streaming'
  )
    return true;

  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;


  return true;
}

export const BlockMessages = memo(PureBlockMessages, areEqual);
