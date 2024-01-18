import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertExists } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { CREATE_REVIEW_FUNCTION_CALLBACK_ID } from "./create_review_function.ts";
import CreateReviewFunction from "./create_review_function.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

mf.install();

const inputs = {
  user_id: "223123",
  module_name: "name test",
  review: "review",
  modules: [{ id: "1a", code: "CM0000", name: "name test", rating: 1.2 }],
};

const { createContext } = SlackFunctionTester(
  CREATE_REVIEW_FUNCTION_CALLBACK_ID,
);

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
