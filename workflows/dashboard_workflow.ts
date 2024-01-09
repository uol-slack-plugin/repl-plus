import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const DashboardWorkflow = DefineWorkflow({
  callback_id: "dashboard-workflow",
  title: "Repl plus workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

export default DashboardWorkflow;
