import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import DashboardWorkflow from "../workflows/dashboard_workflow.ts";

const dashboardTrigger: Trigger<typeof DashboardWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Dashboard trigger",
  workflow: `#/workflows/${DashboardWorkflow.definition.callback_id}`,
  inputs: {
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default dashboardTrigger;
