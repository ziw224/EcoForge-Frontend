import { R_Fetch } from "./fetch";

// Function to fetch optimization results
export const fetchOptimizationResults = async (
  uid: string,
  taskId: string,
  companyId: string
) => {
  const url = "/cement/opt/result";
  const options: RequestInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  try {
    const response = await R_Fetch(
      `${url}?uid=${uid}&taskId=${taskId}&companyId=${companyId}`,
      options
    );
    console.log("Optimization results fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching optimization results:", error);
    throw error;
  }
};

// Function to fetch prediction result
export const fetchPredictionResult = async (
  uid: string,
  taskId: string,
  companyId: string,
  formData: FormData
) => {
  const url = "/cement/opt/compResult";
  const options: RequestInit = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData, // Send FormData as the body
  };

  try {
    const response = await R_Fetch(
      `${url}?uid=${uid}&taskId=${taskId}&companyId=${companyId}`,
      options
    );
    console.log("Prediction result fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching prediction result:", error);
    throw error;
  }
};

