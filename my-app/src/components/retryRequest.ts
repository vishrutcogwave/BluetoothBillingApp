export const retryRequest = async <T>(
  apiCall: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    if (retries <= 0) {
      console.error("API failed after retries", error);
      throw error;
    }

    console.warn(`API failed. Retrying... (${retries})`);
    await new Promise((res) => setTimeout(res, delay));

    return retryRequest(apiCall, retries - 1, delay);
  }
};
