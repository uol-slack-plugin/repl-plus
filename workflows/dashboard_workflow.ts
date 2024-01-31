import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "../functions/generate_dashboard/definition.ts";
import { GetModulesDefinition } from "../functions/api_operations/get_modules.ts";

const DASHBOARD_WORKFLOW_CALLBACK_ID = "dashboard_workflow";

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

const getModulesStep = DashboardWorkflow.addStep(GetModulesDefinition, {});

DashboardWorkflow.addStep(
  GenerateDashboardDefinition,
  {
    user_id: DashboardWorkflow.inputs.user_id,
    modules: getModulesStep.outputs.modules,
  },
);

export default DashboardWorkflow;
