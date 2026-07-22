import { URL } from "./constants";

export async function channelCreate(name, type, serverId) {
  try {
    const response = await fetch(`${URL}/channels/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, serverId }),
    });

    if (!response.ok) throw new Error("ERROR!");

    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function channelFetch(serverId) {
  try {
    const response = await fetch(`${URL}/channels/get/${serverId}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
