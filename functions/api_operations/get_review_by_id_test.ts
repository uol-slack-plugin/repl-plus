import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GET_REVIEW_BY_ID_FUNCTION_CALLBACK_ID } from "./get_review_by_id.ts";
import GetReviewById from "./get_review_by_id.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";

import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester(GET_REVIEW_BY_ID_FUNCTION_CALLBACK_ID);
mf.install();

const inputs = {id:"randomId1234"};

//TEST 1
Deno.test("TEST 1: The 'outputs' retrieves a Review Type object if successfully calls the API", async () => {

  const mockReview: DatastoreItem<typeof ReviewsDatastore.definition> = {
    "created_at": 1705945160264,
    "id": inputs.id,
    "module_id": "module1111",
    "rating_difficulty": 4,
    "rating_learning": 1,
    "rating_quality": 2,
    "review": "This is a sample review.",
    "time_consumption": 4,
    "updated_at": 1705945160264,
    "user_id": "U02FR10ETMY",
  }
  const expectedReview = {
    "id": inputs.id,
    "user_id": "U02FR10ETMY",
    "module_id": "module1111",
    "review":"This is a sample review.",
    "time_consumption":4,
    "rating_quality":2,
    "rating_difficulty":4,
    "rating_learning":1,
    "created_at": 1705945160264,
    "updated_at": 1705945160264,
  }
  
  mf.mock("POST@/api/apps.datastore.get", () => {
    return new Response(
      `{
        "ok":true,
        "datastore":"drafts",
        "item":${JSON.stringify(mockReview)}}`,
      {
        status: 200,
      },
    );
  });
  const { outputs } = await GetReviewById(createContext({ inputs }));
  assertEquals(outputs?.review, expectedReview)

});

// TEST 2
Deno.test("TEST 2: returns an error if the API call fails (apps.datastore.query) ", async () => {
  mf.mock("POST@/api/apps.datastore.get", () => {
    return new Response(
      `{"ok": false,"error":"Error, unsuccessful connection"}`,
      {
        status: 200,
      },
    );
  });

  const { error } = await GetReviewById(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error accessing modules datastore (Error detail: Error, unsuccessful connection)",
  );
});