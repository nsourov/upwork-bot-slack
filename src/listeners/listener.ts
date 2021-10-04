import { App, SayFn, SlashCommand, SlackAction } from "@slack/bolt";

export abstract class Listener {
  abstract startTrackerCommand: string;
  abstract startAction: string;
  abstract stopAction: string;

  abstract onCommand(command: SlashCommand, say: SayFn): void;
  abstract onAction(action: string, body: SlackAction, say: SayFn): void;

  startListen(app: App) {
    app.command(this.startTrackerCommand, async ({ command, ack, say }) => {
      try {
        await ack();
        this.onCommand(command, say);
      } catch (error) {
        console.error(error);
      }
    });

    app.action(this.startAction, async ({ body, ack, say }) => {
      try {
        await ack();
        this.onAction(this.startAction, body, say);
      } catch (error) {
        console.error(error);
      }
    });

    app.action(this.stopAction, async ({ body, ack, say }) => {
      try {
        await ack();
        this.onAction(this.stopAction, body, say);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
