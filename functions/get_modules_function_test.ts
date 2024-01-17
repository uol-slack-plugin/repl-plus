import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { GET_MODULES_CALLBACK_ID } from "./get_modules_function.ts";
import GetModules from "./get_modules_function.ts";

const { createContext } = SlackFunctionTester(GET_MODULES_CALLBACK_ID);

Deno.test("Output should be an empty object", async ()=>{
  await GetModules(createContext({ inputs:{}}));
  
})

