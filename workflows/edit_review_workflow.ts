import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const EditReviewWorkflow = DefineWorkflow({
  callback_id: "edit-review-workflow",
  title: "Edit a review Workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

export default EditReviewWorkflow;
