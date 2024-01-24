import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import FindModuleId from "./find_module_id.ts";
import { FIND_MODULE_ID_FUNCTION_CALLBACK_ID } from "./find_module_id.ts";

import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";

const { createContext } = SlackFunctionTester(
  FIND_MODULE_ID_FUNCTION_CALLBACK_ID,
);

// TEST 1
Deno.test("TEST 1: Retrieve module_id by module_name", async () => {
  const inputs = {
    module_name: "name test",
    modules: [
      { id: "U045A5X302V", code: "CM0000", name: "name test", rating: 1.2 },
      { id: "A032DSX392X", code: "CM0001", name: "name test 2", rating: 2.2 },
    ],
  };

  const { outputs } = await FindModuleId(createContext({ inputs }));
  assertEquals(outputs?.module_id, "U045A5X302V");
});

// TEST 2
Deno.test("TEST 2: Return an error if module_name not found", async () => {
  const inputs = {
    module_name: "not found",
    modules: [
      { id: "U045A5X302V", code: "CM0000", name: "name test", rating: 1.2 },
      { id: "A032DSX392X", code: "CM0001", name: "name test 2", rating: 2.2 },
    ],
  };

  const { error } = await FindModuleId(createContext({ inputs }));
  assertExists(error);
  assertEquals(
    error,
    "Error: No module found (Error detail: TypeError: Cannot read properties of undefined (reading 'id'))",
  );
});