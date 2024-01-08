import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import FindReviewWorkflow from "../workflows/find_review_workflow.ts";

const findReviewTrigger: Trigger<typeof FindReviewWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Edit a review",
  description: "Edit a review for a module of the Computer Science from UoL",
  workflow: `#/workflows/${FindReviewWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default findReviewTrigger;
