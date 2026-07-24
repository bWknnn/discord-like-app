import { URL } from "./constants";

export async function registerUser(userName, email, password) {
  try {
    const response = await fetch(`${URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userName, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("Unable to connect to server. Please check your connection.");
    }
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("Unable to connect to server. Please check your connection.");
    }
    throw error;
  }
}

export async function logOut() {
  try {
    const response = await fetch(`${URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`);
    }
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("Unable to connect to server. Please check your connection.");
    }
    throw error;
  }
}
