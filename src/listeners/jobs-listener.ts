import { SayFn, SlackAction, SlashCommand } from "@slack/bolt";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { Listener } from "./listener";
import { startJobTrackerCommand } from "./commands";
import { startJobTrackerAction, stopJobTrackerAction } from "./actions";
import { JobsDb } from "../types";
import { jsonDb } from "../db";
import { Scheduler } from "../cron-jobs/cron";
import { getJobs } from "../fetcher/jobs";
import { filterJobs } from "../utils/filter-jobs";

export class JobTrackerListener extends Listener {
  startTrackerCommand = startJobTrackerCommand;
  startAction = startJobTrackerAction;
  stopAction = stopJobTrackerAction;
  scheduler: Scheduler;

  constructor() {
    super();
    this.scheduler = new Scheduler();
  }

  async onCommand(command: SlashCommand, say: SayFn) {
    await say({
      blocks: [
        {
          type: "actions",
          elements: [
            {
              type: "button",
              style: "primary",
              text: {
                type: "plain_text",
                text: "👀 Start Job Tracker",
              },
              value: this.startAction,
              action_id: this.startAction,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "🛑 Stop Job Tracker",
              },
              value: this.stopAction,
              action_id: this.stopAction,
            },
          ],
        },
      ],
    });
  }

  async onAction(action: string, body: SlackAction, say: SayFn) {
    switch (action) {
      case this.startAction:
        await this.onStartAction(say);
        break;

      case this.stopAction:
        await this.onStopAction(say);
        break;

      default:
        break;
    }
  }

  async onStartAction(say: SayFn) {
    try {
      const jobsDb = jsonDb.get("jobs") as JobsDb;
      if (!jobsDb.fetchJobs) {
        // create id
        const jobId = uuidv4();
        // create schedule job
        this.scheduler.addJob(jobId, () => this.notifyTargetJobs(say));
        this.scheduler.startSchedule(jobId);
        // save to db
        jsonDb.set("jobs", { ...jobsDb, fetchJobs: true, jobId });
        return say(`🔥 Tracking started`);
      } else {
        return say(`ℹ️ Tracker is already running`);
      }
    } catch (error) {
      console.log(error);
      return say(`💀 Something went wrong`);
    }
  }

  async onStopAction(say: SayFn) {
    try {
      const jobsDb = jsonDb.get("jobs") as JobsDb;
      if (!jobsDb.fetchJobs) {
        return say(`🤚 Tracking already stopped`);
      } else {
        this.scheduler.stopSchedule(jobsDb.jobId);
        this.scheduler.removeJob(jobsDb.jobId);
        jsonDb.set("jobs", { ...jobsDb, fetchJobs: false, jobId: "" });
        return say(`🤝 Stopped tracker`);
      }
    } catch (error) {
      console.log(error);
      return say(`ℹ️ Tracker is already running`);
    }
  }

  async notifyTargetJobs(say: SayFn) {
    const filters = process.env.TRACKER_FILTERS!.split(", ");
    const { results } = await getJobs({
      cookies: process.env.UPWORK_COOKIES!,
      token: process.env.UPWORK_BEARER_TOKEN!,
    });
    const filteredJobs = filterJobs(results, filters);
    await this.generateTemplate(filteredJobs, say);
  }

  async generateTemplate(jobs: any, say: SayFn) {
    let blocks = [];
    if (jobs.length > 0) {
      const data = jobs.map((job: any, index: number) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${index + 1}. ${job.title}*\n\n${dayjs(
            job.publishedOn
          ).format("DD-MM-YYYY hh:mm A")} - $${job.amount.amount}\n${job.attrs
            .map((attr: any) => attr.prettyName)
            .slice(0, 4)
            .join(", ")}\n\n<https://www.upwork.com/jobs/${
            job.ciphertext
          }|View job>\n\n`,
        },
      }));
      blocks = data;
    } else {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `No job found in specified filter 🙁`,
        },
      });
    }

    // add stop button

    blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "🛑 Stop Job Tracker",
          },
          value: this.stopAction,
          action_id: this.stopAction,
        },
      ],
    });
    await say({ blocks });
  }
}
