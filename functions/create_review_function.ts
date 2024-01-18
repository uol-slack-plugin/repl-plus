import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { ModulesArrayType } from "../types/modules.ts";
import { REVIEWS_DATASTORE_NAME } from "../datastores/reviews_datastore.ts";

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

export default SlackFunction(CreateReviewFunction, async({ inputs, client }) => {
  console.log("Create review function inputs: ",inputs);

  const reviewID = crypto.randomUUID();

  const res = await client.apps.datastore.put({
    datastore: REVIEWS_DATASTORE_NAME,
    item: {
      id: reviewID,
      module_id: "111",
      user_id: inputs.user_id,
      review: inputs.review,
      time_consumption: inputs.time_consumption,
      rating_quality: inputs.rating_quality,
      rating_difficulty: inputs.rating_difficulty,
      rating_learning: inputs.rating_learning,
      created_at: Date.now(),
      updated_at: Date.now()
    }})

    if (!res.ok) {
      const queryErrorMsg = `Error when creating a new entry for reviews datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg};
    }

    console.log("RES",res)

  return { outputs:{} };
});
