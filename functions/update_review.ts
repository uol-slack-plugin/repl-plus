import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";
import {
  convertDifficultyRatingToInt,
  convertRatingToInt,
  convertTimeRatingToInt,
} from "../utils/converters.ts";

// CONSTANTS
export const UPDATE_REVIEW_FUNCTION_CALLBACK_ID = "update_review_function";

// DEFINITION
export const UpdateReviewDefinition = DefineFunction({
  callback_id: UPDATE_REVIEW_FUNCTION_CALLBACK_ID,
  title: "Update review function",
  source_file: "functions/update_review.ts",
  input_parameters: {
    properties: {
      id: { type: Schema.types.string },
      review: { type: Schema.types.string },
      rating_quality: { type: Schema.types.string },
      rating_difficulty: { type: Schema.types.string },
      rating_learning: { type: Schema.types.string },
      time_consumption: { type: Schema.types.string },
    },
    required: [
      "id",
      "review",
      "rating_quality",
      "rating_difficulty",
      "rating_learning",
      "time_consumption",
    ],
  },
  output_parameters: {
    properties: {
      ok: { type: Schema.types.object },
    },

    required: ["ok"],
  },
});

//IMPLEMENTATION
export default SlackFunction(
  UpdateReviewDefinition,
  async ({ inputs, client }) => {
    
    // call the API
    const res = await client.apps.datastore.update<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      item: {
        id: inputs.id,
        review: inputs.review,
        time_consumption: convertTimeRatingToInt(inputs.time_consumption),
        rating_quality: convertRatingToInt(inputs.rating_quality),
        rating_difficulty: convertDifficultyRatingToInt(
          inputs.rating_difficulty,
        ),
        rating_learning: convertRatingToInt(inputs.rating_learning),
        updated_at: Date.now(),
      },
    });

    // handle error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }

    return {
      outputs: {
        ok: res.ok,
      },
    };
  },
);
