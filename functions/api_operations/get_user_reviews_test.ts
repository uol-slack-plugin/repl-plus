import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GET_USER_REVIEWS_FUNCTION_CALLBACK_ID } from "./get_user_reviews.ts";
import GetUserReviews from "./get_user_reviews.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";

import { assertEquals, assertExists } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
mf.install();

const { createContext } = SlackFunctionTester(
  GET_USER_REVIEWS_FUNCTION_CALLBACK_ID,
);

const inputs = { user_id: "U02FR10ETMY" };
const mockReviews: DatastoreItem<typeof ReviewsDatastore.definition>[] = [
  {
    "created_at": 1705945160264,
    "id": "2222",
    "module_id": "module1111",
    "rating_difficulty": 4,
    "rating_learning": 1,
    "rating_quality": 2,
    "review": "This is a sample review.",
    "time_consumption": 4,
    "updated_at": 2222,
    "user_id": "U02FR10ETMY",
  },
  {
    "created_at": 1705945160264,
    "id": "1111",
    "module_id": "module1111",
    "rating_difficulty": 4,
    "rating_learning": 1,
    "rating_quality": 2,
    "review": "This is a sample review.",
    "time_consumption": 4,
    "updated_at": 1111,
    "user_id": "U02FR10ETMY",
  },
  {
    "created_at": 1705945160264,
    "id": "4444",
    "module_id": "module1111",
    "rating_difficulty": 4,
    "rating_learning": 1,
    "rating_quality": 2,
    "review": "This is a sample review.",
    "time_consumption": 4,
    "updated_at": 4444,
    "user_id": "U02FR10ETMY",
  },
];

const expectedReviews = [
  {
    "id": "2222",
    "user_id": "U02FR10ETMY",
    "module_id": "module1111",
    "review": "This is a sample review.",
    "time_consumption": 4,
    "rating_quality": 2,
    "rating_difficulty": 4,
    "rating_learning": 1,
    "created_at": 1705945160264,
    "updated_at": 2222,
  },
  {
    "id": "1111",
    "user_id": "U02FR10ETMY",
    "module_id": "module1111",
    "review": "This is a sample review.",
    "time_consumption": 4,
    "rating_quality": 2,
    "rating_difficulty": 4,
    "rating_learning": 1,
    "created_at": 1705945160264,
    "updated_at": 1111,
  },
  {
    "id": "4444",
    "user_id": "U02FR10ETMY",
    "module_id": "module1111",
    "review": "This is a sample review.",
    "time_consumption": 4,
    "rating_quality": 2,
    "rating_difficulty": 4,
    "rating_learning": 1,
    "created_at": 1705945160264,
    "updated_at": 4444,
  },
];

//TEST 1
Deno.test("TEST 1: Retrieves user reviews if successfully calls the API", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{
        "ok":true,
        "datastore":"drafts",
        "items":${JSON.stringify(mockReviews)}}`,
      {
        status: 200,
      },
    );
  });
  const { outputs } = await GetUserReviews(createContext({ inputs }));
  assertEquals(outputs?.reviews, expectedReviews);
});

// TEST 2
Deno.test("TEST 2: returns an error if the API call fails (apps.datastore.query)", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{"ok": false,"error":"Error, unsuccessful connection"}`,
      {
        status: 200,
      },
    );
  });

  const { error } = await GetUserReviews(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error accessing reviews datastore (Error detail: Error, unsuccessful connection)",
  );
});
