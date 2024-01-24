import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ModulesDatastore from "../../datastores/modules_datastore.ts";
import { Module } from "../../types/module.ts";

/**
 * This function retrieves an array with all the modules
 */

// CONSTANTS
export const GET_MODULES_FUNCTION_CALLBACK_ID = "get_modules_function";

// DEFINITION
export const GetModulesDefinition = DefineFunction({
  callback_id: GET_MODULES_FUNCTION_CALLBACK_ID,
  title: "Get modules function",
  source_file: "functions/api_operations/get_modules.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: [],
  },
  output_parameters: {
    properties: {
      ok: { type: Schema.types.boolean },
      modules: { type: Schema.types.array, items: { type: Module } },
      interactivity: { type: Schema.slack.types.interactivity },
    },

    required: ["ok", "modules"],
  },
});

// IMPLEMENTATION
export default SlackFunction(
  GetModulesDefinition,
  async ({ inputs, client }) => {
    // create an instance of modules
    const modules = new Map<string, {
      id: string;
      code: string;
      name: string;
      rating: number;
    }>();

    // call the API
    const res = await client.apps.datastore.query<
      typeof ModulesDatastore.definition
    >({
      datastore: ModulesDatastore.name,
    });

    // handle error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing modules datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }

    // set modules from response
    res.items.forEach((item) => {

      modules.set(item.id, {
        id: item.id,
        code: item.code,
        name: item.name,
        rating: item.rating,
      });
    });

    // add module names from query
    const module_names = res.items?.map((item) => item.name);

    return {
      outputs: {
        ok: res.ok,
        modules: [...modules.entries()].map((r) => r[1]),
        module_names,
        interactivity: inputs.interactivity,
      },
    };
  },
);
