import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GET_MODULES_CALLBACK_ID } from "./get_modules_function.ts";
import GetModules from "./get_modules_function.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";


const { createContext } = SlackFunctionTester(GET_MODULES_CALLBACK_ID);

Deno.test("Retrieve an object", async ()=>{
  const {outputs} = await GetModules(createContext({ inputs:{}}));
  assertEquals(typeof outputs?.modules, "object" )
})

Deno.test("Call the API and retrieve payload with a property ok set to true", async ()=>{
  const {outputs} = await GetModules(createContext({ inputs:{}}));
  assertEquals(outputs?.payload, {ok: false} )
})
