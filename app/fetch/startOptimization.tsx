import { R_Fetch } from "./fetch";

// Function to start optimization
export const startOptimization = async (
  uid: string,
  taskId: string,
  companyId: string,
  formData: FormData
) => {
  const url = "/cement/opt/start";
  const options: RequestInit = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData, 
  };

  try {
    const response = await R_Fetch(
      `${url}?uid=${uid}&taskId=${taskId}&companyId=${companyId}`,
      options
    );
    console.log("Prediction started successfully:", response);
    return response;
  } catch (error) {
    console.error("Error starting prediction:", error);
    throw error;
  }
};
