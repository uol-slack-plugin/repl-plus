import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { DELETE_REVIEW_FUNCTION_CALLBACK_ID } from "./delete_review.ts";
import DeleteReview  from "./delete_review.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester(DELETE_REVIEW_FUNCTION_CALLBACK_ID);

const inputs = {
  id:"6f10a80a-96fc-4279-8acd-3d3cdfc88b61"
};

mf.install();

// TEST 1
Deno.test("TEST 1: The 'outputs.ok' is true if successfully calls the API and deletes a review", async () => {
  mf.mock("POST@/api/apps.datastore.delete", () => {
    return new Response(
      `{"ok":true}`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await DeleteReview(createContext({ inputs }));
  assertExists(outputs);
  assertEquals(outputs?.ok, true);
});

//TEST 2
Deno.test("TEST 2: Returns an error if the API call fails (apps.datastore.query) ", async () => {
  mf.mock("POST@/api/apps.datastore.delete", () => {
    return new Response(
      `{"ok": false,"error":"Error, unsuccessful connection"}`,
      {
        status: 200,
      },
    );
  });

  const { error } = await DeleteReview(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error accessing reviews datastore (Error detail: Error, unsuccessful connection)",
  );
});