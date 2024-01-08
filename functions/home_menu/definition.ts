import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const HomeMenuFunction = DefineFunction({
  callback_id: "home-menu-definition",
  title: "Home Menu",
  source_file: "functions/home_menu/definition.ts",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
});
