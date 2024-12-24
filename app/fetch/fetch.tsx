const baseURL = "http://39.103.57.214:8181/api/v2";

// General fetch function
export const R_Fetch = async (url: string, option: RequestInit) => {
  const res = await fetchRequest(baseURL + url, option);
  const text = await fetchText(res);

  if (!res.ok) {
    throw (() => {
      try {
        const data = fetchJson(text);
        return new Error(`Error: ${data?.message || text}`);
      } catch (e) {}
      return new Error(text || "Unknown Error");
    })();
  }

  return fetchJson(text);
};

// Handle fetch request
const fetchRequest = async (url: string, option: RequestInit) => {
  try {
    return await fetch(url, option);
  } catch (error: any) {
    throw new Error(`Network Error: ${error.message}`);
  }
};

// Extract text from response
const fetchText = async (response: Response) => {
  try {
    return await response.text();
  } catch (e: any) {
    throw new Error(`Failed to get response text: ${e.message}`);
  }
};

// Parse JSON response
const fetchJson = (text: string) => {
  try {
    const data = JSON.parse(text);
    if (!data) {
      throw new Error("The API did not return expected data.");
    }
    return data;
  } catch (e: any) {
    throw new Error(`Failed to parse JSON response: ${e.message}`);
  }
};
