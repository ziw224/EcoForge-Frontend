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
