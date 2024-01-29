import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";
import { Review } from "../../types/review.ts";

/**
 * This function retrieves all 
 * the reviews from a specific user
 */

// CONSTANTS
export const GET_USER_REVIEWS_FUNCTION_CALLBACK_ID =
  "get_user_reviews_function";

// DEFINITION
export const GetUserReviewsDefinition = DefineFunction({
  callback_id: GET_USER_REVIEWS_FUNCTION_CALLBACK_ID,
  title: "Get user reviews function",
  source_file: "functions/api_operations/get_user_reviews.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      user_id: { type: Schema.slack.types.user_id },
    },
    required: ["user_id"],
  },
  output_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      reviews: { type: Schema.types.array, items: { type: Review } },
    },

    required: ["reviews"],
  },
});

//IMPLEMENTATION
export default SlackFunction(
  GetUserReviewsDefinition,
  async ({ inputs, client }) => {
    // create an instance of review
    const reviews = new Map<string, {
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
    const res = await client.apps.datastore.query<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      expression: "#user_id = :user_id",
      expression_attributes: { "#user_id": "user_id" },
      expression_values: { ":user_id": inputs.user_id },
    });

    // handle error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }

    res.items.forEach((item) => {
      reviews.set(item.id, {
        id: item.id,
        user_id: item.user_id,
        module_id: item.module_id,
        review: item.content,
        time_consumption: item.time_consumption,
        rating_quality: item.rating_quality,
        rating_difficulty: item.rating_difficulty,
        rating_learning: item.rating_learning,
        created_at: item.created_at,
        updated_at: item.updated_at,
      });
    });

    return {
      outputs: {
        reviews: [...reviews.entries()].map((r) => r[1]),
        interactivity: inputs.interactivity,
      },
    };
  },
);
