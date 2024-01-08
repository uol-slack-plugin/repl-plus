import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
//import { HomeMenuFunction } from "./definition.ts";
import { READ_REVIEW_ID } from "./constants.ts";
import { HomeView, ReadReviewView } from "./views.ts";

export const HomeMenuFunction = DefineFunction({
  callback_id: "home-menu-definition",
  title: "Home Menu",
  source_file: "functions/home_menu/mod.ts",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
});

export default SlackFunction(HomeMenuFunction, async ({ inputs, client }) => {
  await client.views.open({
    interactivity_pointer: inputs.interactivity.interactivity_pointer,
    view: HomeView,
  });
  return {
    completed: false,
  };
}).addBlockActionsHandler(
  READ_REVIEW_ID,
  async ({ body, client }) => {
    const response = await client.views.open({
      interactivity_pointer: body.interactivity.interactivity_pointer,
      view: ReadReviewView,
    });
    console.log(body.interactivity.interactivity_pointer);
    if (response.error) console.log(response.error);
  },
);
