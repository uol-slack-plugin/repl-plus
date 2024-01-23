import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Module } from "../types/module.ts";

// CONSTANTS
export const FIND_MODULE_ID_FUNCTION_CALLBACK_ID = "find_module_id_function";

// DEFINITION
export const FindModuleIdDefinition = DefineFunction({
  callback_id: FIND_MODULE_ID_FUNCTION_CALLBACK_ID,
  title: "Find module id function",
  source_file: "functions/find_module_id.ts",
  input_parameters: {
    properties: {
      module_name: { type: Schema.types.string },
      modules: { type: Schema.types.array, items: {type: Module} },
    },
    required: [
      "modules",
      "module_name",
    ],
  },
  output_parameters: {
    properties: {
      module_id: { type: Schema.types.string },
    },
    required: ["module_id"],
  },
});

// IMPLEMENTATION
export default SlackFunction(
  FindModuleIdDefinition,
  ({ inputs }) => {

    // retrieve module id from module name
    let moduleId;
    try {
      moduleId = inputs.modules.filter((module) =>
        module.name === inputs.module_name
      )[0].id;
    }
    
    catch (e) {
      return { error: `Error: No module found (Error detail: ${e})` };
    }

    return { outputs: { module_id: moduleId } };
  },
);