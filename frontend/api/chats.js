import { handleApiRequest } from "./api-handler";

const ENDPOINT = "/api/history";

export async function getChatById({ id, accessToken, projectId }) {

    if (!accessToken || !projectId) {
      console.log('Access Token or Project ID is missing');
      return;
    }
  const result = await handleApiRequest("GET", `${ENDPOINT}/${id}`, {
    headerOptions: {
      'accesstoken': `${accessToken}`,
      'x-project-id': `${projectId}`,
    },
  });

  return result;
}
