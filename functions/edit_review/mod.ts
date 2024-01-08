import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { ReadReviewView } from "./views.ts";

export const EditReviewFunction = DefineFunction({
  callback_id: "edit-review-function",
  title: "Edit Review Function",
  source_file: "functions/edit_review/mod.ts",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
});

export default SlackFunction(EditReviewFunction, async ({ inputs, client }) => {
  await client.views.open({
    interactivity_pointer: inputs.interactivity.interactivity_pointer,
    view: ReadReviewView,
  });
  return {
    completed: false,
  };
});
