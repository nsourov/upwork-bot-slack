import { CronJob } from "cron";

export class Scheduler {
  jobs: any;

  constructor() {
    this.jobs = {};
  }

  getJob(jobId: string) {
    return this.jobs[jobId] as CronJob;
  }

  addJob(jobId: string, cb: () => void) {
    if (this.jobs[jobId]) return;

    // const job = new CronJob(`*/10 * * * * *`, cb, null, true);
    const job = new CronJob(
      `*/${Number(process.env.TRACKER_INTERVAL)} * * * *`,
      cb,
      null,
      true
    );
    this.jobs[jobId] = job;
  }

  removeJob(jobId: string) {
    if (!this.jobs[jobId]) return;
    delete this.jobs[jobId];
  }

  startSchedule(jobId: string) {
    const job = this.getJob(jobId);
    if (!job) return;
    job.start();
  }

  stopSchedule(jobId: string) {
    const job = this.getJob(jobId);
    if (!job) return;
    job.stop();
  }
}
