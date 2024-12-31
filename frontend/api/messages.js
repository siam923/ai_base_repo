import { handleApiRequest } from "./api-handler";

const ENDPOINT = "/api/history";

export async function getMessageById({ id, accessToken, projectId }) {
  if (!accessToken || !projectId) {
    console.log("Access Token or Project ID is missing");
    return;
  }
  const { data, error } = await handleApiRequest(
    "GET",
    `${ENDPOINT}/message/${id}`,
    {
      headerOptions: {
        accesstoken: `${accessToken}`,
        "x-project-id": `${projectId}`,
      },
    }
  );

  if (error) {
    throw new Error(error);
  }
  return data;
}

export async function getMessagesByChatId({ chatId, accessToken, projectId }) {
  if (!accessToken || !projectId) {
    console.log("Access Token or Project ID is missing");
    return;
  }
  const { data, error } = await handleApiRequest(
    "GET",
    `${ENDPOINT}/messages/${chatId}`,
    {
      headerOptions: {
        accesstoken: `${accessToken}`,
        "x-project-id": `${projectId}`,
      },
    }
  );

  return {data, error}
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
  accessToken,
  projectId,
}) {
  if (!accessToken || !projectId) {
    console.log("Access Token or Project ID is missing");
    return;
  }
  const { data, error } = await handleApiRequest(
    "DELETE",
    `${ENDPOINT}/message`,
    {
      body: { chatId, timestamp },
      headerOptions: {
        accesstoken: `${accessToken}`,
        "x-project-id": `${projectId}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (error) {
    throw new Error(error);
  }
  return data;
}
