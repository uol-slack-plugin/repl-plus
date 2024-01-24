// deno-lint-ignore-file
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";

import {
  convertDifficultyRatingToInt,
  convertRatingToInt,
  convertTimeRatingToInt,
} from "../../utils/converters.ts";

/**
 * This function stores a new review entry
 */

export const CREATE_REVIEW_FUNCTION_CALLBACK_ID = "create_review_function";

// DEFINITION
export const CreateReviewDefinition = DefineFunction({
  callback_id: CREATE_REVIEW_FUNCTION_CALLBACK_ID,
  title: "Create review function",
  source_file: "functions/api_operations/create_review.ts",
  input_parameters: {
    properties: {
      user_id: { type: Schema.slack.types.user_id },
      module_id: { type: Schema.types.string },
      review: { type: Schema.types.string },
      rating_quality: { type: Schema.types.string },
      rating_difficulty: { type: Schema.types.string },
      rating_learning: { type: Schema.types.string },
      time_consumption: { type: Schema.types.string },
    },
    required: [
      "user_id",
      "module_id",
      "review",
      "rating_quality",
      "rating_difficulty",
      "rating_learning",
      "time_consumption",
    ],
  },
  output_parameters: {
    properties: {
      ok: { type: Schema.types.boolean },
      item: { type: Schema.types.object },
    },
    required: ["item"],
  },
});

export default SlackFunction(
  CreateReviewDefinition,
  async ({ inputs, client }) => {

    const reviewId = crypto.randomUUID();

    // Call the API
    const res = await client.apps.datastore.put<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      item: {
        id: reviewId,
        module_id: inputs.module_id,
        user_id: inputs.user_id,
        review: inputs.review,
        time_consumption: convertTimeRatingToInt(inputs.time_consumption),
        rating_quality: convertRatingToInt(inputs.rating_quality),
        rating_difficulty: convertDifficultyRatingToInt(
          inputs.rating_difficulty,
        ),
        rating_learning: convertRatingToInt(inputs.rating_learning),
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    });

    // handle API error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }

    return { outputs: { ok: res.ok, item: res.item } };
  },
);
