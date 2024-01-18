// deno-lint-ignore-file
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { ModulesArrayType, ModuleType } from "../types/modules.ts";
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
      review: { type: Schema.types.string },
      rating_quality: { type: Schema.types.integer },
      rating_difficulty: { type: Schema.types.integer },
      rating_learning: { type: Schema.types.integer },
      time_consumption: { type: Schema.types.integer },
      modules: {type: ModulesArrayType}
    },
    required: ["modules","module_name","user_id","review"],
  },
  output_parameters: {
    properties: {
      payload: {type: Schema.types.object}
    },
    required: [],
  },
});

export default SlackFunction(CreateReviewFunction, async({ inputs, client }) => {

  // create an id for the review
  const reviewID = crypto.randomUUID();
  
  // retrieve module id from module name
  let moduleID;
  try{
    moduleID = inputs.modules.filter((m)=>m.name === inputs.module_name)[0].id
  }
  // handle no module found error
  catch(e){
      const queryErrorMsg = `Error: no module name find in modules (Error detail: ${e})`;
      return { error: queryErrorMsg};
  }

  // Call the API
  const res = await client.apps.datastore.put({
    datastore: REVIEWS_DATASTORE_NAME,
    item: {
      id: reviewID,
      module_id: moduleID,
      user_id: inputs.user_id,
      review: inputs.review,
      time_consumption: inputs.time_consumption,
      rating_quality: inputs.rating_quality,
      rating_difficulty: inputs.rating_difficulty,
      rating_learning: inputs.rating_learning,
      created_at: Date.now(),
      updated_at: Date.now()
    }})

    // handle API error
    if (!res.ok) {
      const queryErrorMsg = `Error when creating a new entry for reviews datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg};
    }

  return { outputs:{ payload: res} };
});