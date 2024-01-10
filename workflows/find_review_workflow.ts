import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const FindReviewWorkflow = DefineWorkflow({
  callback_id: "find-review-workflow",
  title: "Find a review Workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

export default FindReviewWorkflow;
