import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";
import { Review } from "../../types/review.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";

/** 
 * This function retrieves an array of reviews 
 * ordered by updated time in descending order 
 * */

// CONSTANTS
export const GET_LATEST_REVIEWS_FUNCTION_CALLBACK_ID =
  "get_latest_reviews_function";

// DEFINITION
export const GetLatestReviewsDefinition = DefineFunction({
  callback_id: GET_LATEST_REVIEWS_FUNCTION_CALLBACK_ID,
  title: "Get latest reviews function",
  source_file: "functions/api_operations/get_latest_reviews.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: [],
  },
  output_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      reviews: { type: Schema.types.array, items: { type: Review } },
    },

    required: [],
  },
});

//IMPLEMENTATION
export default SlackFunction(
  GetLatestReviewsDefinition,
  async ({ inputs, client }) => {
    // create an instance of review
    const review = new Map<string, {
      id: string;
      user_id: string
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
    });

    // handle error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing modules datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }

    quickSort(res.items, 0, res.items.length - 1);

    res.items.forEach((item) => {
      review.set(item.id, {
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
        reviews: [...review.entries()].map((r) => r[1]),
        interactivity: inputs.interactivity,
      },
    };
  },
);

// Function to partition the array and return the partition index
function partition(
  arr: DatastoreItem<typeof ReviewsDatastore.definition>[],
  low: number,
  high: number,
) {
  // Choosing the pivot
  const pivot = arr[high].updated_at;

  // Index of smaller element and indicates the right position of pivot found so far
  let i = low - 1;

  for (let j = low; j <= high - 1; j++) {
    // If current element is smaller than the pivot
    if (arr[j].updated_at > pivot) {
      // Increment index of smaller element
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Swap pivot to its correct position
  return i + 1; // Return the partition index
}

// The main function that implements QuickSort
function quickSort(
  arr: DatastoreItem<typeof ReviewsDatastore.definition>[],
  low: number,
  high: number,
) {
  if (low < high) {
    //pi is the partitioning index, arr[pi] is now at the right place
    const pi = partition(arr, low, high);

    //Separately sort elements before partition and after partition
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}
