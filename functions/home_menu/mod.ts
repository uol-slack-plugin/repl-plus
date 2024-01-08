import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { view } from "./view.ts";

export const HomeMenuFunction = DefineFunction({
  callback_id: "home-menu-definition",
  title: "Home Menu",
  source_file: "functions/home_menu/mod.ts",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
});

export default SlackFunction(
  HomeMenuFunction,
  async ({ inputs, client }) => {
    const response = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: view,
    });
    if (response.error) console.log(response);
    return {
      completed: false,
    };
  },
);
