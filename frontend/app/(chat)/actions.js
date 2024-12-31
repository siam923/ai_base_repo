'use server';

import { deleteMessagesByChatIdAfterTimestamp, getMessageById } from '@/api/messages';
import { cookies } from 'next/headers';

export async function setContext({accessToken, projectId}) {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken);
  cookieStore.set('projectId', projectId);
}


export async function saveModelId(model) {
  const cookieStore = await cookies();
  cookieStore.set('model-id', model);
}

export async function generateTitleFromUserMessage({
  message,
}) {
  const title = 'Chat';

  return title;
}

export async function deleteTrailingMessages({ id }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

