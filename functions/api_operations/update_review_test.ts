import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { UPDATE_REVIEW_FUNCTION_CALLBACK_ID } from "./update_review.ts";
import UpdateReview from "./update_review.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester(
  UPDATE_REVIEW_FUNCTION_CALLBACK_ID,
);
mf.install();

const inputs = {
  id: "6f10a80a-96fc-4279-8acd-3d3cdfc88b61",
  rating_difficulty: "Moderately difficult",
  rating_learning: "Poor",
  rating_quality: "Poor",
  review: "This is a review update",
  time_consumption: "Practically none (1 - 5 hours per week)",
};

// TEST 1
Deno.test("TEST 1: The 'outputs.ok' is true if successfully calls the API and updates a review", async () => {
  mf.mock("POST@/api/apps.datastore.update", () => {
    return new Response(
      `{
        "ok":true,
        "datastore":"reviews_datastore",
        "item":{
           "created_at":1705945160264,
           "id":"6f10a80a-96fc-4279-8acd-3d3cdfc88b61",
           "module_id":"1",
           "rating_difficulty":4,
           "rating_learning":1,
           "rating_quality":2,
           "review":"This is a review update",
           "time_consumption":4,
           "updated_at":1705945160264,
           "user_id":"U02FR10ETMY"
        }
     }`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await UpdateReview(createContext({ inputs }));
  assertExists(outputs);
  assertEquals(outputs?.ok, true);
});

//TEST 2
Deno.test("TEST 2: Returns an error if the API call fails (apps.datastore.query) ", async () => {
  mf.mock("POST@/api/apps.datastore.update", () => {
    return new Response(
      `{"ok": false,"error":"Error, unsuccessful connection"}`,
      {
        status: 200,
      },
    );
  });

  const { error } = await UpdateReview(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error accessing reviews datastore (Error detail: Error, unsuccessful connection)",
  );
});
