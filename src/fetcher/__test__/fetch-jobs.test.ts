import { getJobs } from "../jobs";

it("can fetch jobs from upwork", async () => {
  const cookies = process.env.UPWORK_COOKIES as string;
  const token = process.env.UPWORK_BEARER_TOKEN as string;
  const res = await getJobs({ cookies, token });
  expect(res).toHaveProperty("results");
});

it("can fails to fetch jobs from upwork when no cookie added", async () => {
  const res = await getJobs({ cookies: "", token: "" });
  expect(res).toHaveProperty("details");
  expect((res as any).details).toEqual(
    "User not authenticated and access is not allowed"
  );
});
