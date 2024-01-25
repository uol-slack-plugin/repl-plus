import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID } from "./definition.ts";
import GenerateDashboard from "./mod.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
mf.install();

const { createContext } = SlackFunctionTester(
  GENERATE_DASHBOARD_FUNCTION_CALLBACK_ID,
);

const inputs ={
  latest_reviews: [
    {
      "id": "1111",
      "user_id": "U02FR10ETMY",
      "module_id":"module1111",
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
      "module_id":"module1111",
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
      "module_id":"module1111",
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
      "module_id":"module1111",
      "review": "This is a sample review.",
      "time_consumption": 4,
      "rating_quality": 2,
      "rating_difficulty": 4,
      "rating_learning": 1,
      "created_at": 1705945160264,
      "updated_at": 4444,
    },
  ],
  user_id: "user_test"

}

mf.mock("POST@/api/chat.postMessage", async (req) => {
  const body = await req.formData();
  if (body.get("channel")?.toString() !== "U22222") {
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

Deno.test("TEST 1: API response is successful with ok: true and the stored item", async () => {

  await GenerateDashboard(createContext({ inputs }));

});