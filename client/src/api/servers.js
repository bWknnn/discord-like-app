import { URL } from "./constants";

export async function createServer(serverName, owner) {
  try {
    const response = await fetch(`${URL}/servers/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverName, owner }),
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

export async function getJoinedServers(userId) {
  try {
    const response = await fetch(`${URL}/servers/joined/${userId}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function getJoinableServers(userId) {
  try {
    const response = await fetch(`${URL}/servers/joinable/${userId}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function addMember(userId, serverId) {
  try {
    const response = await fetch(`${URL}/members/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, serverId }),
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
