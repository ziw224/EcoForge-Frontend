import { Spin } from "antd";
import { createRoot } from "react-dom/client";

const baseURL = "http://39.103.57.214:8181/api/v2";
// General fetch function
export const R_Fetch = async (url: string, option: RequestInit) => {
  showLoading();
  const res = await fetchRequest(baseURL + url, option);
  const text = await fetchText(res);

  if (!res.ok) {
    hideLoading();
    throw (() => {
      try {
        const data = fetchJson(text);
        return new Error(`Error: ${data?.message || text}`);
      } catch (e) {}
      return new Error(text || "Unknown Error");
    })();
  }

  hideLoading();
  return fetchJson(text);
};

// Handle fetch request
const fetchRequest = async (url: string, option: RequestInit) => {
  try {
    return await fetch(url, option);
  } catch (error: any) {
    hideLoading();
    throw new Error(`Network Error: ${error.message}`);
  }
};

// Extract text from response
const fetchText = async (response: Response) => {
  try {
    return await response.text();
  } catch (e: any) {
    hideLoading();
    throw new Error(`Failed to get response text: ${e.message}`);
  }
};

// Parse JSON response
const fetchJson = (text: string) => {
  try {
    const data = JSON.parse(text);
    if (!data) {
      hideLoading();
      throw new Error("The API did not return expected data.");
    }
    return data;
  } catch (e: any) {
    hideLoading();
    throw new Error(`Failed to parse JSON response: ${e.message}`);
  }
};

// Loading management
let loadingCount = 0;

const showLoading = () => {
  if (loadingCount === 0) {
    const dom = document.createElement("div");
    dom.setAttribute("id", "loading");
    document.body.appendChild(dom);
    createRoot(dom).render(<Spin tip="Loading..." fullscreen />);
  }
  loadingCount++;
};

const hideLoading = () => {
  loadingCount--;
  if (loadingCount === 0) {
    const loadingDom = document.getElementById("loading");
    if (loadingDom) {
      document.body.removeChild(loadingDom);
    }
  }
};