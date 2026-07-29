import { URL } from "./constants";

export async function createServer(serverName, user_uid) {
  try {
    const response = await fetch(`${URL}/servers/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ serverName, user_uid }),
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

export async function getJoinedServers() {
  try {
    const response = await fetch(`${URL}/servers/joined`, {
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

export async function getJoinableServers() {
  try {
    const response = await fetch(`${URL}/servers/joinable`, {
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

export async function addMember(serverIdOrUserId, optionalServerId) {
  const serverId = optionalServerId || serverIdOrUserId;
  try {
    const response = await fetch(`${URL}/members/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ serverId }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
