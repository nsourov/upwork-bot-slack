export interface FetchJobsParams {
  cookies: string;
  token: string;
}

export interface JobsDb {
  fetchJobs: boolean,
  jobId: string
}