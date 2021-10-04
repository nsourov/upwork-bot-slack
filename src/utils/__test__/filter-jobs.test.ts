import { filterJobs } from "../filter-jobs";
import jobs from "./jobs.json";

it("should filter specific stacks jobs from jobs array", () => {
  const result = filterJobs(jobs, ["api", "test"]);
  expect(Array.isArray(result)).toBe(true);
  expect(result).toHaveLength(2);
});

it("should not get any job that does not meet specific stacks", () => {
  const result = filterJobs(jobs, ["invalid stack"]);
  expect(Array.isArray(result)).toBe(true);
  expect(result).toHaveLength(0);
});

it("should return empty array when invalid array passed", () => {
  const result = filterJobs(null, ["invalid argument"]);
  expect(Array.isArray(result)).toBe(true);
  expect(result).toHaveLength(0);
});
