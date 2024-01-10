import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const DashboardWorkflow = DefineWorkflow({
  callback_id: "dashboard-workflow",
  title: "Repl plus workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

export default DashboardWorkflow;
