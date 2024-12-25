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
    // console.log("Progress fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching progress:", error);
    throw error;
  }
};

export const pollProgress = (
  uid: string,
  taskId: string,
  companyId: string,
  onProgress: (progress: any) => void,
  onError: (error: any) => void,
  interval: number = 1000 // 1 second
) => {
  let isPolling = true; // Control flag to stop polling manually

  const intervalId = setInterval(async () => {
    if (!isPolling) {
      clearInterval(intervalId); // Ensure polling stops
      return;
    }

    try {
      const progress = await checkProgress(uid, taskId, companyId);
      onProgress(progress);

      // If progress and desc indicate completion, stop polling
      if (
        progress.data.desc === "Stage 3: Finding lower KH ratios" &&
        progress.data.progress === 1
      ) {
        console.log("finished")
        clearInterval(intervalId);
        isPolling = false; // Set the flag to stop further execution
      }
    } catch (error) {
      console.error("Polling error:", error);
      onError(error);
      clearInterval(intervalId); // Stop polling on error
    }
  }, interval);

  return () => {
    isPolling = false; // Stop polling manually
    clearInterval(intervalId);
  };
};
