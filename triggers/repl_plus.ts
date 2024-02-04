import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import DashboardWorkflow from "../workflows/repl_plus_workflow.ts";

const ReplPlusTrigger: Trigger<typeof DashboardWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "REPL Plus Trigger",
  workflow: `#/workflows/${DashboardWorkflow.definition.callback_id}`,
  inputs: {
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default ReplPlusTrigger;
