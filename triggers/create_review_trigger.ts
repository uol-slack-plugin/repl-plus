import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import CreateReviewWorkflow from "../workflows/create_review_workflow.ts";

const createReviewTrigger: Trigger<typeof CreateReviewWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Create a review",
  workflow: `#/workflows/${CreateReviewWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default createReviewTrigger;
