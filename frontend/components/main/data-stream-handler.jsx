'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { initialBlockData, useBlock } from '@/hooks/use-block';
import { useUserMessageId } from '@/hooks/use-user-message-id';
import { cx } from 'class-variance-authority';

// type DataStreamDelta = {
//   type:
//     | 'text-delta'
//     | 'code-delta'
//     | 'title'
//     | 'id'
//     | 'suggestion'
//     | 'clear'
//     | 'finish'
//     | 'user-message-id'
//     | 'kind';
//   content: string | Suggestion;
// };

export function DataStreamHandler({ id }) {
  const { data: dataStream } = useChat({ id });
  const { setUserMessageIdFromServer } = useUserMessageId();
  const { setBlock } = useBlock();
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    (newDeltas).forEach((delta) => {
      if (delta.type === 'user-message-id') {
        setUserMessageIdFromServer(delta.content );
        return;
      }

      setBlock((draftBlock) => {
        if (!draftBlock) {
          return { ...initialBlockData, status: 'streaming' };
        }

        switch (delta.type) {
          case 'id':
            return {
              ...draftBlock,
              documentId: delta.content,
              status: 'streaming',
            };

          case 'title':
            return {
              ...draftBlock,
              title: delta.content,
              status: 'streaming',
            };

          case 'kind':
            return {
              ...draftBlock,
              kind: delta.content,
              status: 'streaming',
            };

          case 'text-delta':
            return {
              ...draftBlock,
              content: draftBlock.content + (delta.content),
              isVisible:
                draftBlock.status === 'streaming' &&
                draftBlock.content.length > 400 &&
                draftBlock.content.length < 450
                  ? true
                  : draftBlock.isVisible,
              status: 'streaming',
            };

          case 'code-delta':
            return {
              ...draftBlock,
              content: delta.content,
              isVisible:
                draftBlock.status === 'streaming' &&
                draftBlock.content.length > 300 &&
                draftBlock.content.length < 310
                  ? true
                  : draftBlock.isVisible,
              status: 'streaming',
            };

          case 'clear':
            return {
              ...draftBlock,
              content: '',
              status: 'streaming',
            };

          case 'finish':
            return {
              ...draftBlock,
              status: 'idle',
            };

          default:
            return draftBlock;
        }
      });
    });
  }, [dataStream, setBlock, setUserMessageIdFromServer]);

  return null;
}
