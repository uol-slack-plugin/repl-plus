import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FindReviewFunction } from "../functions/find_review/mod.ts";

const FindReviewWorkflow = DefineWorkflow({
  callback_id: "find-review-workflow",
  title: "Find a review Workflow",
  description: "Find a review Workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

FindReviewWorkflow.addStep(FindReviewFunction, {
  interactivity: FindReviewWorkflow.inputs.interactivity,
});
export default FindReviewWorkflow;
