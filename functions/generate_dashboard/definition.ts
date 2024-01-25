import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID = "generate_dashboard_function"

export const GenerateDashboardDefinition = DefineFunction({
  callback_id: GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID,
  title: "Generate dashboard function",
  source_file: "functions/generate_dashboard/mod.ts",

  input_parameters: {
    properties:{
      user_id: {type: Schema.slack.types.user_id} 
    },
    required: ["user_id"]
  },
});
