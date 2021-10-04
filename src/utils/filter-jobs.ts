import { flatten } from "array-flatten";

export const filterJobs = (jobs: any, filterBy: string[]) => {
  if (!Array.isArray(jobs)) return [];

  const filteredJobs = filterBy.map((stack) =>
    jobs.filter(
      (job: any) =>
        job.client.paymentVerificationStatus === 1 &&
        job.proposalsTier === "Less than 5" &&
        !!job.attrs.find((attr: any) =>
          attr.prettyName.toLowerCase().includes(stack.toLowerCase())
        )
    )
  );
  return flatten(filteredJobs);
};
