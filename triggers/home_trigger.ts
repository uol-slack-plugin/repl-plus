import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import HomeWorkflow from "../workflows/home_workflow.ts";

const homeTrigger: Trigger<typeof HomeWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Repl Plus",
  description: "An application that lets you read and review UoL modules",
  workflow: `#/workflows/${HomeWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default homeTrigger;
