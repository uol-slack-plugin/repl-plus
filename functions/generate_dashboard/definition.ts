import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { ModulesArray } from "../../types/modules_array.ts";

export const GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID =
  "generate_dashboard_function";

export const GenerateDashboardDefinition = DefineFunction({
  callback_id: GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID,
  title: "Generate dashboard function",
  source_file: "functions/generate_dashboard/mod.ts",

  input_parameters: {
    properties: {
      user_id: { type: Schema.slack.types.user_id },
      modules: { type: ModulesArray },
    },
    required: ["user_id", "modules"],
  },
});
