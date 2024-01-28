import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const EditReviewWorkflow = DefineWorkflow({
  callback_id: "edit-review-workflow",
  title: "Edit a review Workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "user_id"],
  },
});
export default EditReviewWorkflow;
