import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { MODULES_DATASTORE_NAME } from "../datastores/modules_datastore.ts";

// CONSTANTS
export const GET_MODULES_CALLBACK_ID = "get_modules_function"

// DEFINITION
export const GetModulesDefinition = DefineFunction({
  callback_id: GET_MODULES_CALLBACK_ID,
  title: "Get modules function",
  source_file: "functions/get_modules_function.ts",
  output_parameters:{
    properties:{ 
      modules : {type: Schema.types.array, items:{type: Schema.types.object}},
      modules_names : {type: Schema.types.array, items:{type: Schema.types.string}},
     },

      
    required:[]
  }
});

// IMPLEMENTATION
export default SlackFunction(
  GetModulesDefinition,
  async ({ inputs, client }) => {

    // Debug
    console.log("Get Modules Inputs: ", inputs)

    // call the API
    const res = await client.apps.datastore.query({
      datastore: MODULES_DATASTORE_NAME,
    }); 

    // handle datastore error
    if (!res.ok) {
      const queryErrorMsg = `Error accessing modules datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg};
    }

    // add items to modules array
    const modules = res.items
    // add items names to modules_names array
    const modules_names = res.items?.map((item) => item.name);

    return {outputs:{modules, modules_names}}
  },
);
