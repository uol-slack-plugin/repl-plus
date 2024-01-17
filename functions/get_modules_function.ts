import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";

export const GET_MODULES_CALLBACK_ID = "get_modules_function"

export const GetModulesDefinition = DefineFunction({
  callback_id: GET_MODULES_CALLBACK_ID,
  title: "Get modules function",
  source_file: "functions/get_modules_function.ts",

});

export default SlackFunction(
  GetModulesDefinition,
  ({ inputs, }) => {

    console.log("Get Modules Inputs: ", inputs)

    return { outputs: { } };
  },
);
