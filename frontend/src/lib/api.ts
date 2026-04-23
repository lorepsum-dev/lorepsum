const API_URL = import.meta.env.VITE_API_URL ?? "";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      if (typeof errorData.message === "string") {
        message = errorData.message;
      }
    } catch {
      // Keep the default message when the response is not JSON.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export { ApiError, fetchJson };
