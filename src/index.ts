import { App, LogLevel } from "@slack/bolt";
import { JobTrackerListener } from "./listeners/jobs-listener";

const startServer = async () => {
  // clear the terminal
  console.clear();
  // validate env
  if (!process.env.UPWORK_BEARER_TOKEN) {
    throw new Error("UPWORK_BEARER_TOKEN must be provided");
  }
  if (!process.env.UPWORK_COOKIES) {
    throw new Error("UPWORK_COOKIES must be provided");
  }
  if (!process.env.SLACK_SIGNING_SECRET) {
    throw new Error("SLACK_SIGNING_SECRET must be provided");
  }
  if (!process.env.SLACK_BOT_TOKEN) {
    throw new Error("SLACK_BOT_TOKEN must be provided");
  }
  if (!process.env.APP_TOKEN) {
    throw new Error("APP_TOKEN must be provided");
  }
  if (!process.env.TRACKER_INTERVAL) {
    throw new Error("TRACKER_INTERVAL must be provided");
  }
  if (!process.env.TRACKER_FILTERS) {
    throw new Error("TRACKER_FILTERS must be provided");
  }
  if (!process.env.PORT) {
    throw new Error("PORT must be provided");
  }

  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    logLevel: LogLevel.DEBUG,
    appToken: process.env.APP_TOKEN,
  });

  // listeners
  new JobTrackerListener().startListen(app);

  await app.start(Number(process.env.PORT));
  console.log(`app is running on port ${process.env.PORT}`);
};

startServer();
