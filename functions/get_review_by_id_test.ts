import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GET_MODULES_FUNCTION_CALLBACK_ID } from "./get_modules_function.ts";
import GetReviewByID from "./get_review_by_id.ts";
import { Review } from "../types/review.ts";

import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester(GET_MODULES_FUNCTION_CALLBACK_ID);
mf.install();

const inputs = {id:"asdasdjehasywpoid"};

// TEST 1
Deno.test("TEST 1: returns an 'outputs' object if successfully calls the API ", async () => {
  mf.mock("POST@/api/apps.datastore.get", () => {
    return new Response(
      `{
        "ok":true,
        "datastore":"drafts",
        "item":{}
      }`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await GetReviewByID(createContext({ inputs }));
  assertExists(outputs);
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

  const { error } = await GetReviewByID(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error accessing modules datastore (Error detail: Error, unsuccessful connection)",
  );
});

//TEST 3
Deno.test("TEST 3: The 'outputs' retrieves a Review Type object", async () => {
  const review = {
    "id": inputs.id,
    "review":"This is a sample review.",
    "time_consumption":120,
    "rating_quality":5,
    "rating_difficulty":3,
    "rating_learning":4
  }
  
  mf.mock("POST@/api/apps.datastore.get", () => {
    return new Response(
      `{
        "ok":true,
        "datastore":"drafts",
        "item":${JSON.stringify(review)}}`,
      {
        status: 200,
      },
    );
  });
  const { outputs } = await GetReviewByID(createContext({ inputs }));
  assertEquals(typeof outputs?.review, typeof Review)
  assertEquals(outputs?.review, review)

});