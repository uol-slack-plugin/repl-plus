import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import EditReviewWorkflow from "../workflows/edit_review_workflow.ts";

const editReviewTrigger: Trigger<typeof EditReviewWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Edit a review",
  workflow: `#/workflows/${EditReviewWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default editReviewTrigger;
