import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const HomeWorkflow = DefineWorkflow({
  callback_id: "home_workflow",
  title: "Repl plus workflow",
  description: "An application that lets you read and review UoL modules",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user", "interactivity"],
  },
});

export default HomeWorkflow;
