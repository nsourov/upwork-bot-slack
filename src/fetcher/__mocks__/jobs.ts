import { FetchJobsParams } from "../../types";

export const getJobs = jest
  .fn()
  .mockImplementation((params: FetchJobsParams) => {
    // TODO: add a good way to validate cookies format
    if (params.cookies.trim().length < 1) {
      return Promise.resolve({
        details: "User not authenticated and access is not allowed",
      });
    }
    if (params.token.trim().length < 1) {
      return Promise.resolve({
        details: "User not authenticated and access is not allowed",
      });
    }
    return Promise.resolve({ results: [] });
  });
