import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { EditReviewFunction } from "../functions/edit_review/mod.ts";

const EditReviewWorkflow = DefineWorkflow({
  callback_id: "edit-review-workflow",
  title: "Edit a review Workflow",
  description: "Edit a review Workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

EditReviewWorkflow.addStep(EditReviewFunction, {
  interactivity: EditReviewWorkflow.inputs.interactivity,
});
export default EditReviewWorkflow;
