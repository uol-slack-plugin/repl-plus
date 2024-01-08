import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { ReadReviewView } from "./views.ts";

export const FindReviewFunction = DefineFunction({
  callback_id: "find-review-function",
  title: "Find Review Function",
  source_file: "functions/find_review/mod.ts",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
});

export default SlackFunction(FindReviewFunction, async ({ inputs, client }) => {
  await client.views.open({
    interactivity_pointer: inputs.interactivity.interactivity_pointer,
    view: ReadReviewView,
  });
  return {
    completed: false,
  };
});
