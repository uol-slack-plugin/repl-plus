import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "../functions/generate_dashboard/definition.ts";

const DASHBOARD_WORKFLOW_CALLBACK_ID = "dashboard_workflow"

const DashboardWorkflow = DefineWorkflow({
  callback_id: DASHBOARD_WORKFLOW_CALLBACK_ID,
  title: "Dashboard workflow",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user_id"],
  },
});

DashboardWorkflow.addStep(
  GenerateDashboardDefinition,
  {
    user_id: DashboardWorkflow.inputs.user_id,
  },
);


export default DashboardWorkflow;
