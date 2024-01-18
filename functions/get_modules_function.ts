import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { MODULES_DATASTORE_NAME } from "../datastores/modules_datastore.ts";
import { ModulesArrayType } from "../types/modules.ts";

// CONSTANTS
export const GET_MODULES_CALLBACK_ID = "get_modules_function"

// DEFINITION
export const GetModulesDefinition = DefineFunction({
  callback_id: GET_MODULES_CALLBACK_ID,
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
      modules_names : {type: Schema.types.array, items:{type: Schema.types.string}},
      interactivity: {type: Schema.slack.types.interactivity}
     },

    required:["modules","modules_names"]
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

    // handle datastore error
    if (!res.ok) {
      const queryErrorMsg = `Error accessing modules datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg};
    }

    // add modules from datastore
    const modules = res.items;
    // add module names from datastore
    const modules_names = res.items?.map((item) => item.name);

    return {outputs:{modules, modules_names, interactivity: inputs.interactivity}}
  },
);
