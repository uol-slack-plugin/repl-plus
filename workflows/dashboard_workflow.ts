import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { DashboardBlockFunctionDefinition } from "../functions/dashboard_block_function.ts";

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

const getViewBlocksStep = DashboardWorkflow.addStep(
  DashboardBlockFunctionDefinition,
  {},
);

DashboardWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: DashboardWorkflow.inputs.channel,
  message: "Welcome to REPL Plus!",
  interactive_blocks: getViewBlocksStep.outputs.blocks,
});

export default DashboardWorkflow;
