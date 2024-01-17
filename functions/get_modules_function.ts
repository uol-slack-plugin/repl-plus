import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { ModuleType } from "../types/module_type.ts";
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
      modules : {type: ModuleType},
      payload: {type: Schema.types.object}
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
    const res = await await client.apps.datastore.query({
      datastore: MODULES_DATASTORE_NAME,
    }); 

    console.log(res.ok);
    
    const modules = [{id:"111",rare:"no belong"}]
    const payload = {ok:res.ok}

    return { outputs: { modules, payload } };
  },
);
