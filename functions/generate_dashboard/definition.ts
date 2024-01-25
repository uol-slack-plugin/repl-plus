import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { Review } from "../../types/review.ts";

// CONSTANTS
export const GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID = "generate_dashboard_function"

// DEFINITION
export const GenerateDashboardDefinition = DefineFunction({
  callback_id: GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID,
  title: "Generate dashboard function",
  source_file: "functions/generate_dashboard/mod.ts",

  input_parameters: {
    properties:{
      latest_reviews: { type: Schema.types.array, items: {type: Review}},
      test: {type: Review},
      user_id: {type: Schema.slack.types.user_id} 
    },
    required: ["latest_reviews", "user_id"]
  },

  output_parameters: {
    properties: {
      blocks: { type: Schema.slack.types.blocks },
    },
    required: [],
  },
});
