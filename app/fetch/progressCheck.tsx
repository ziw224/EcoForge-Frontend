import { R_Fetch } from "./fetch";

// Function to check optimization progress
export const checkProgress = async (
  uid: string,
  taskId: string,
  companyId: string
) => {
  const url = "/cement/opt/progress";
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
    console.log("Progress fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching progress:", error);
    throw error;
  }
};

// Utility function to poll the progress every second
export const pollProgress = (
  uid: string,
  taskId: string,
  companyId: string,
  onProgress: (progress: any) => void,
  onError: (error: any) => void,
  interval: number = 1000 // 1 second
) => {
  const intervalId = setInterval(async () => {
    try {
      const progress = await checkProgress(uid, taskId, companyId);
      onProgress(progress);

      // If progress indicates completion, clear the interval
      if (progress.status === "completed") {
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error("Polling error:", error);
      onError(error);
      clearInterval(intervalId); // Stop polling on error
    }
  }, interval);

  return () => clearInterval(intervalId); // Return function to stop polling manually
};
