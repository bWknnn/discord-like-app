const URL = "http://localhost:8080/api/servers";

export async function createServer(serverName, owner) {
  try {
    const response = await fetch(URL + "/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverName, owner }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function getServers() {
  try {
    const response = await fetch(URL);

    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}
