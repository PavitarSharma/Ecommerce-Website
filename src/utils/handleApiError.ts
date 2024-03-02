import { AxiosError } from "axios";

interface ApiResponse {
  message: string;
}

// Function to handle errors
export const handleApiError = (error: AxiosError) => {
  let message: string;

  if (error.response) {
    if (
      error.response.status === 409 ||
      error.response.status === 400 ||
      error.response.status === 404 ||
      error.response.status === 403 ||
      error.response.status === 500
    ) {
      // Use type assertion to tell TypeScript that error.response.data is of type ApiResponse
      message =
        (error.response.data as ApiResponse)?.message || "Unknown error";
    } else if (error.response.status === 401) {
      message = "Unauthorized. Please log in.";
    } else {
      message = "Something went wrong with the API request.";
    }
  } else if (error.request) {
    message = "No response received from the server.";
  } else {
    message = "An error occurred while processing the request.";
  }

  return message;
};
