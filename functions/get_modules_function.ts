import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { MODULES_DATASTORE_NAME } from "../datastores/modules_datastore.ts";
import { ModulesArrayType } from "../types/modules.ts";

// CONSTANTS
export const GET_MODULES_FUNCTION_CALLBACK_ID = "get_modules_function"

// DEFINITION
export const GetModulesDefinition = DefineFunction({
  callback_id: GET_MODULES_FUNCTION_CALLBACK_ID,
  title: "Get modules function",
  source_file: "functions/get_modules_function.ts",
  input_parameters: {
    properties:{
      interactivity: {type: Schema.slack.types.interactivity}
    },
    required:[]
  },
  output_parameters:{
    properties:{ 
      modules : {type: ModulesArrayType},
      module_names : {type: Schema.types.array, items:{type: Schema.types.string}},
      interactivity: {type: Schema.slack.types.interactivity}
     },

    required:["modules","module_names"]
  }
});

// IMPLEMENTATION
export default SlackFunction(
  GetModulesDefinition,
  async ({ inputs, client }) => {

    // call the API
    const res = await client.apps.datastore.query({
      datastore: MODULES_DATASTORE_NAME,
    }); 

    // handle error
    if (!res.ok) {
      const queryErrorMsg = `Error accessing modules datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg};
    }

    // add modules from query
    const modules = res.items;
    // add module names from query
    const module_names = res.items?.map((item) => item.name);

    return {outputs:{modules, module_names, interactivity: inputs.interactivity}}
  },
);
