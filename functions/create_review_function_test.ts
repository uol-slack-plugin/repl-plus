import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { CREATE_REVIEW_FUNCTION_CALLBACK_ID } from "./create_review_function.ts";
import { REVIEWS_DATASTORE_NAME } from "../datastores/reviews_datastore.ts";
import CreateReviewFunction from "./create_review_function.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester(
  CREATE_REVIEW_FUNCTION_CALLBACK_ID,
);
mf.install();

const inputs = {
  user_id: "223123",
  module_name: "name test",
  review: "review",
  modules: [
    { id: "U045A5X302V", code: "CM0000", name: "name test", rating: 1.2 },
    { id: "A032DSX392X", code: "CM0001", name: "name test 2", rating: 2.2 },
  ],
};

const inputs2 = {
  user_id: "223123",
  module_name: "different name from modules",
  review: "review",
  modules: [
    { id: "U045A5X302V", code: "CM0000", name: "name test", rating: 1.2 },
    { id: "A032DSX392X", code: "CM0001", name: "name test 2", rating: 2.2 },
  ],
};

const APIResponse1 = {
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
Deno.test("returns an outputs object if successfully calls the API", async () => {
  mf.mock("POST@/api/apps.datastore.put", () => {
    return new Response(
      `{"ok": true}`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await CreateReviewFunction(createContext({ inputs }));
  assertExists(outputs);
});

// TEST 2
Deno.test("returns an error if the API call fails (apps.datastore.query", async () => {
  mf.mock("POST@/api/apps.datastore.put", () => {
    return new Response(
      `{"ok": false}`,
      {
        status: 200,
      },
    );
  });

  const { error } = await CreateReviewFunction(createContext({ inputs }));
  assertExists(error);
});

// TEST 3
Deno.test("should retrieve the module_id from module_name in a payload object", async () => {
  mf.mock("POST@/api/apps.datastore.put", () => {
    return new Response(
      `${JSON.stringify(APIResponse1)}`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await CreateReviewFunction(createContext({ inputs }));
  assertEquals(outputs?.payload.item.module_id, inputs.modules[0].id);
});

// TEST 4
Deno.test("should return and error if the module_id is not found from the module_name", async () => {
  const { error } = await CreateReviewFunction(
    createContext({ inputs: inputs2 }),
  );
  assertExists(error);
});
