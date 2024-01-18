import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { ModulesArrayType } from "../types/modules.ts";

export const CREATE_REVIEW_FUNCTION_CALLBACK_ID = "create_review_function";

// DEFINITION
export const CreateReviewFunction = DefineFunction({
  callback_id: CREATE_REVIEW_FUNCTION_CALLBACK_ID,
  title: "Create review function",
  source_file: "functions/create_review_function.ts",
  input_parameters: {
    properties: {
      user_id: { type: Schema.slack.types.user_id },
      module_name: { type: Schema.types.string },
      review: { type: Schema.slack.types.rich_text },
      rating_quality: { type: Schema.types.integer },
      rating_difficulty: { type: Schema.types.integer },
      rating_learning: { type: Schema.types.integer },
      time_consumption: { type: Schema.types.integer },
      modules: {type: ModulesArrayType}
    },
    required: [],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(CreateReviewFunction, ({ inputs }) => {
  console.log("Create review function inputs: ",inputs);
  return { outputs: {} };
});
