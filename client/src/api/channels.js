import { URL } from "./constants";

export async function channelFetch(serverId) {
  try {
    const response = await fetch(`${URL}/channels/get/${serverId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
