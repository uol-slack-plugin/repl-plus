import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "../functions/generate_dashboard/definition.ts";
import { GetModulesDefinition } from "../functions/api_operations/get_modules.ts";

const REPL_PLUS_WORKFLOW_CALLBACK_ID = "repl_plus_workflow";

const ReplPlusWorkflow = DefineWorkflow({
  callback_id: REPL_PLUS_WORKFLOW_CALLBACK_ID,
  title: "REPL Plus workflow",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user_id"],
  },
});

const getModulesStep = ReplPlusWorkflow.addStep(GetModulesDefinition, {});

ReplPlusWorkflow.addStep(
  GenerateDashboardDefinition,
  {
    user_id: ReplPlusWorkflow.inputs.user_id,
    modules: getModulesStep.outputs.modules,
  },
);

export default ReplPlusWorkflow;
