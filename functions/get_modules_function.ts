import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { MODULES_DATASTORE_NAME } from "../datastores/modules_datastore.ts";

export const GetModules = DefineFunction({
  callback_id: "get_modules_function",
  title: "Get modules function",
  source_file: "functions/get_modules_function.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
  output_parameters: {
    properties: {
      module_names: {
        type: Schema.types.array,
        items: { type: Schema.types.string },
      },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["module_names","interactivity"],
  },
});

export default SlackFunction(
  GetModules,

  // call datastore API
  async ({ inputs, client }) => {

    const response = await client.apps.datastore.query({
      datastore: MODULES_DATASTORE_NAME,
    });    

    // map strings to array
    const module_names = [...response.items].map((item) => item.name);
    // pass interactivity
    const interactivity = inputs.interactivity;

    return { outputs: { module_names, interactivity } };
  },
);
