import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID } from "./definition.ts";
import GenerateDashboard from "./mod.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.153.0/testing/asserts.ts";
mf.install();

const { createContext } = SlackFunctionTester(
  GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID,
);

const inputs = {
  latest_reviews: [
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
      "id": "3333",
      "user_id": "U02FR10ETMY",
      "module_id": "module1111",
      "review": "This is a sample review.",
      "time_consumption": 4,
      "rating_quality": 2,
      "rating_difficulty": 4,
      "rating_learning": 1,
      "created_at": 1705945160264,
      "updated_at": 3333,
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
  ],
  user_id: "user_test",
};

const mockReviews: DatastoreItem<typeof ReviewsDatastore.definition>[] = [
  {
    "created_at": 1705945160264,
    "id": "2222",
    "module_id": "module1111",
    "rating_difficulty": 4,
    "rating_learning": 1,
    "rating_quality": 2,
    "content": "This is a sample review.",
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
    "content": "This is a sample review.",
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
    "content": "This is a sample review.",
    "time_consumption": 4,
    "updated_at": 4444,
    "user_id": "U02FR10ETMY",
  },
  {
    "created_at": 1705945160264,
    "id": "3333",
    "module_id": "module1111",
    "rating_difficulty": 4,
    "rating_learning": 1,
    "rating_quality": 2,
    "content": "This is a sample review.",
    "time_consumption": 4,
    "updated_at": 3333,
    "user_id": "U02FR10ETMY",
  },
];

mf.mock("POST@/api/chat.postMessage", async (req) => {
  const body = await req.formData();

  if (body.get("channel")?.toString() !== "user_test") {
    return new Response(`{"ok": false, "error": "unexpected channel ID"}`, {
      status: 200,
    });
  }
  if (body.get("blocks") === undefined) {
    return new Response(`{"ok": false, "error": "blocks are missing!"}`, {
      status: 200,
    });
  }
  return new Response(`{"ok": true, "message": {"ts": "111.222"}}`, {
    status: 200,
  });
});



Deno.test("TEST 1: API response is successful with completed value returns false", async () => {
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
  const { completed } = await GenerateDashboard(createContext({ inputs }));
  assertEquals(completed, false);
});

Deno.test("TEST 2: Should return an error if API datastore.query fails", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{"ok": false,"error":"Error, unsuccessful connection"}`,
      {
        status: 200,
      },
    );
  });

  const { error } = await GenerateDashboard(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error accessing reviews datastore (Error detail: Error, unsuccessful connection)",
  );
});

Deno.test("TEST 3: Should return an error if API chat.postMessage fails", async () => {
  const inputs ={
    latest_reviews: [
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
    ],
    user_id: "wrong channel",
  };
  
  
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

  const { error } = await GenerateDashboard(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error when sending message client.chat.postMessage (Error detail: unexpected channel ID)",
  );
});

Deno.test("TEST 4: Should return a completed object with false value if there are no reviews", async () => {
  
  const inputs ={
    latest_reviews: [
    ],
    user_id: "user_test",
  };
  
  
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

  const { completed } = await GenerateDashboard(createContext({ inputs }));
  assertEquals(completed, false);

});