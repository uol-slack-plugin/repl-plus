import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GET_LATEST_REVIEWS_FUNCTION_CALLBACK_ID } from "./get_latest_reviews.ts";
import GetLatestReviews from "./get_latest_reviews.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester(
  GET_LATEST_REVIEWS_FUNCTION_CALLBACK_ID,
);

const inputs = {};

const reviews = [
  {
    "id": "1111",
    "review": "This is a sample review.",
    "time_consumption": 120,
    "rating_quality": 5,
    "rating_difficulty": 3,
    "rating_learning": 4,
  },
  {
    "id": "2222",
    "review": "This is a sample review.",
    "time_consumption": 120,
    "rating_quality": 5,
    "rating_difficulty": 3,
    "rating_learning": 4,
  },
  {
    "id": "3333",
    "review": "This is a sample review.",
    "time_consumption": 120,
    "rating_quality": 5,
    "rating_difficulty": 3,
    "rating_learning": 4,
  },
  {
    "id": "4444",
    "review": "This is a sample review.",
    "time_consumption": 120,
    "rating_quality": 5,
    "rating_difficulty": 3,
    "rating_learning": 4,
  },
];

mf.install();

// TEST 1
Deno.test("TEST 1: returns an 'outputs' object if successfully calls the API", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{
        "ok":true,
        "datastore":"drafts",
        "items":${JSON.stringify(reviews)}}`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await GetLatestReviews(createContext({ inputs }));
  assertExists(outputs);
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

  const { error } = await GetLatestReviews(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error accessing modules datastore (Error detail: Error, unsuccessful connection)",
  );
});

//TEST 3
Deno.test("TEST 3: Reviews are ordered by update time in descending order", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{
        "ok":true,
        "datastore":"drafts",
        "items":[
        {
          "id":"1111",
          "review":"This is a sample review.",
          "time_consumption":120,
          "rating_quality":5,
          "rating_difficulty":3,
          "rating_learning":4,
          "updated_at":1111
        },
        {
          "id":"3333",
          "review":"This is a sample review.",
          "time_consumption":120,
          "rating_quality":5,
          "rating_difficulty":3,
          "rating_learning":4,
          "updated_at":3333
        },
        {
          "id":"2222",
          "review":"This is a sample review.",
          "time_consumption":120,
          "rating_quality":5,
          "rating_difficulty":3,
          "rating_learning":4,
          "updated_at":2222
        },
        {
          "id":"4444",
          "review":"This is a sample review.",
          "time_consumption":120,
          "rating_quality":5,
          "rating_difficulty":3,
          "rating_learning":4,
          "updated_at":4444
        }
      ]}`,
      {
        status: 200,
      },
    );
  });
  const { outputs } = await GetLatestReviews(createContext({ inputs }));
  assertEquals(outputs?.reviews, [reviews[3],reviews[2],reviews[1],reviews[0]]);
});
