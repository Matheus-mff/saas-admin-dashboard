type ErrorResponse = {
  message?: string;
};

export async function getApiErrorMessage(
  response: Response,
  fallbackMessage: string
): Promise<string> {
  try {
    const data = (await response.json()) as ErrorResponse;

    return data.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}
