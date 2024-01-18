import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GET_MODULES_CALLBACK_ID } from "./get_modules_function.ts";
import GetModules from "./get_modules_function.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";

const { createContext } = SlackFunctionTester(GET_MODULES_CALLBACK_ID);

const inputs = {};

const dummy_data = [{
  id: "id_1",
  code: "test_code",
  name: "test_name",
  rating: 1.3
},
{
  id: "id_2",
  code: "test_code2",
  name: "test_name2",
  rating: 2.3
}]

mf.install();

Deno.test("returns an outputs object if successfully calls the API ", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{"ok": true}`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await GetModules(createContext({ inputs }));
  assertExists(outputs);
});

Deno.test("returns an error if datastore fails (apps.datastore.query) ", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{"ok": false,"error":"hello error"}`,
      {
        status: 200,
      },
    );
  });

  const { error } = await GetModules(createContext({ inputs }));
  assertExists(error);
});

Deno.test("outputs.modules should return an array of object ", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{"ok": true,"items":${JSON.stringify(dummy_data)}}`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await GetModules(createContext({ inputs }));
  console.log("outputs: ",outputs)
  assertEquals(outputs?.modules, dummy_data )
});

Deno.test("outputs.modules_names should return an array of strings ", async () => {
  mf.mock("POST@/api/apps.datastore.query", () => {
    return new Response(
      `{"ok": true,"items":${JSON.stringify(dummy_data)}}`,
      {
        status: 200,
      },
    );
  });

  const { outputs } = await GetModules(createContext({ inputs }));
  console.log("outputs: ",outputs)
  assertEquals(outputs?.modules_names, ["test_name","test_name2"] )
});