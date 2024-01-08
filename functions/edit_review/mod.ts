import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { view } from "./view.ts";

export const EditReviewFunction = DefineFunction({
  callback_id: "edit-review-function",
  title: "Edit Review Function",
  source_file: "functions/edit_review/mod.ts",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
});

export default SlackFunction(
  EditReviewFunction,
  async ({ inputs, client }) => {
    const response = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: view,
    });
    if (response.error) console.log(response.error);
    return {
      completed: false,
    };
  },
);
