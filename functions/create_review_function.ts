import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

// DEFINITION
export const CreateReviewFunction = DefineFunction({
  callback_id: "create_review_function",
  title: "Create review function",
  source_file: "functions/create_review_function.ts",
  input_parameters: {
    properties: {
      user_id : { type: Schema.slack.types.user_id },
      module_name: { type: Schema.types.string },
      review: { type: Schema.slack.types.rich_text },
      rating_quality: { type: Schema.types.integer },
      rating_difficulty: { type: Schema.types.integer },
      rating_learning: { type: Schema.types.integer },
      time_consumption: { type: Schema.types.integer },
    },
    required: ["user_id","module_name","review"],
  },
  output_parameters: {
    properties: {
    },
    required: [],
  },
});

