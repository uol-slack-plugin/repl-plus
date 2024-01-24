import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GET_MODULES_FUNCTION_CALLBACK_ID } from "./get_modules.ts";
import GetModules from "./get_modules.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

mf.install();

const { createContext } = SlackFunctionTester(GET_MODULES_FUNCTION_CALLBACK_ID);

const inputs = {};

// TEST 1
Deno.test("TEST 1: API response is successful with ok: true, and the modules array", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    
    const APIResponse = {
      ok: true,
      items: [
        { id: "U045A5X302V", code: "CM0000", name: "name1", rating: 1.2 },
        { id: "A032DSX392X", code: "CM0001", name: "name2" },
      ],
    };

    return new Response(
      `${JSON.stringify(APIResponse)}`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await GetModules(createContext({ inputs }));
  assertEquals(outputs?.ok, true);
  assertEquals(outputs?.modules, [
    { id: "U045A5X302V", code: "CM0000", name: "name1", rating: 1.2 },
    { id: "A032DSX392X", code: "CM0001", name: "name2", rating: undefined },
  ]);
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

  const { error } = await GetModules(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error accessing modules datastore (Error detail: Error, unsuccessful connection)",
  );
});
