import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { dashboardBlocks } from "../blocks/dashboard.ts";
export const DashboardBlockFunctionDefinition = DefineFunction({
  callback_id: "dashboard_block_function",
  title: "Dashboard block function",
  source_file: "functions/dashboard_block_function.ts",

  output_parameters: {
    properties: {
      blocks: {
        type: Schema.slack.types.blocks,
      },
    },
    required: ["blocks"],
  },
});

export default SlackFunction(DashboardBlockFunctionDefinition, ({ env }) => {
  const blocks = [
    {
      ...dashboardBlocks(env),
    },
  ];

  return { outputs: { blocks } };
});
