import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "../functions/generate_dashboard/definition.ts";
import { GetLatestReviewsDefinition } from "../functions/api_operations/get_latest_reviews.ts";

const DASHBOARD_WORKFLOW_CALLBACK_ID = "dashboard_workflow"

const DashboardWorkflow = DefineWorkflow({
  callback_id: DASHBOARD_WORKFLOW_CALLBACK_ID,
  title: "Dashboard workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user_id"],
  },
});

const getLatestReviewsStep = DashboardWorkflow.addStep(
  GetLatestReviewsDefinition,
  {
    interactivity: DashboardWorkflow.inputs.interactivity
  },
);

DashboardWorkflow.addStep(
  GenerateDashboardDefinition,
  {
    user_id: DashboardWorkflow.inputs.user_id,
    latest_reviews: getLatestReviewsStep.outputs.reviews
  },
);


export default DashboardWorkflow;
