import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Review } from "../../types/review.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";

/**
 * This function retrieves a review 
 */

// CONSTANTS
export const GET_REVIEW_BY_ID_FUNCTION_CALLBACK_ID =
  "get_review_by_id_function";

// DEFINITION
export const GetReviewByIdDefinition = DefineFunction({
  callback_id: GET_REVIEW_BY_ID_FUNCTION_CALLBACK_ID,
  title: "Get review by ID function",
  source_file: "functions/api_operations/get_review_by_id.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      id: { type: Schema.types.string },
    },
    required: ["id"],
  },
  output_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      review: { type: Review },
    },

    required: [],
  },
});

//IMPLEMENTATION
export default SlackFunction(
  GetReviewByIdDefinition,
  async ({ inputs, client }) => {
    // create an instance of review
    const review = new Map<string, {
      id: string;
      user_id: string;
      module_id: string;
      review: string;
      time_consumption: number;
      rating_quality: number;
      rating_difficulty: number;
      rating_learning: number;
      created_at: number;
      updated_at: number;
    }>();

    // call the API
    const res = await client.apps.datastore.get<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      id: inputs.id,
    });

    // handle error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing modules datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }

    // set review
    review.set(res.test, {
      id: res.item.id,
      user_id: res.item.user_id,
      module_id: res.item.module_id,
      review: res.item.review,
      time_consumption: res.item.time_consumption,
      rating_quality: res.item.rating_quality,
      rating_difficulty: res.item.rating_difficulty,
      rating_learning: res.item.rating_learning,
      created_at: res.item.created_at,
      updated_at: res.item.updated_at,
    });

    return {
      outputs: {
        review: [...review.entries()].map((r) => r[1])[0],
        interactivity: inputs.interactivity,
      },
    };
  },
);
