import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";

/**
 * This function deletes a review entry from the datastore
 */

// CONSTANTS
export const DELETE_REVIEW_FUNCTION_CALLBACK_ID =
  "delete_review_function";

// DEFINITION
export const DeleteReviewDefinition = DefineFunction({
  callback_id: DELETE_REVIEW_FUNCTION_CALLBACK_ID,
  title: "Delete review function",
  source_file: "functions/api_operations/delete_review.ts",
  input_parameters: {
    properties: {
      id: {type: Schema.types.string}
    },
    required: ["id"],
  },
  output_parameters: {
    properties: {
      ok: { type: Schema.types.boolean },
    },

    required: ["ok"],
  },
});

//IMPLEMENTATION
export default SlackFunction(
  DeleteReviewDefinition,
  async ({ inputs, client }) => {
    
    // call the API
    const res = await client.apps.datastore.delete<
    typeof ReviewsDatastore.definition
  >({
      datastore: ReviewsDatastore.name,
      id: inputs.id,
    });

    // handle error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }

    return { outputs: { ok: res.ok },
    };
  },
);
