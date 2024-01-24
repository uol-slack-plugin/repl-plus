import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { CREATE_REVIEW_FUNCTION_CALLBACK_ID } from "./create_review.ts";
import { REVIEWS_DATASTORE_NAME } from "../../datastores/reviews_datastore.ts";
import CreateReview from "./create_review.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester(
  CREATE_REVIEW_FUNCTION_CALLBACK_ID,
);
mf.install();

const inputs = {
  user_id: "223123",
  module_id: "U045A5X302V",
  review: "review",
  rating_difficulty: "Moderately difficult",
  rating_learning: "Poor",
  rating_quality: "Poor",
  time_consumption: "Practically none (1 - 5 hours per week)"
};

const APIResponse = {
  ok: true,
  datastore: REVIEWS_DATASTORE_NAME,
  item: {
    id: "906dba92-44f5-4680-ada9-065149e4e930",
    module_id: "U045A5X302V",
    user_id: "user1",
    review: "test review",
    time_consumption: 1,
    rating_quality: 2,
    rating_difficulty: 3,
    rating_learning: 4,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
};

// TEST 1
Deno.test("TEST 1: API response is successful with ok: true and the stored item", async () => {
  mf.mock("POST@/api/apps.datastore.put", () => {
    return new Response(
      `${JSON.stringify(APIResponse)}`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await CreateReview(createContext({ inputs }));
  assertEquals(outputs?.item, APIResponse.item);
  assertEquals(outputs?.ok, true);
});

//TEST 2
Deno.test("TEST 2: Returns an error if the API call fails (apps.datastore.query) ", async () => {
  mf.mock("POST@/api/apps.datastore.put", () => {
    return new Response(
      `{"ok": false,"error":"Error, unsuccessful connection"}`,
      {
        status: 200,
      },
    );
  });

  const { error } = await CreateReview(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error accessing reviews datastore (Error detail: Error, unsuccessful connection)",
  );
});
