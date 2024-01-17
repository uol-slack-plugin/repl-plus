import { Manifest } from "deno-slack-sdk/mod.ts";

// Workflows
import DashboardWorkflow from "./workflows/dashboard_workflow.ts";
import CreateReviewWorkflow from "./workflows/create_review_workflow.ts";
import EditReviewWorkflow from "./workflows/edit_review_workflow.ts";
import FindReviewWorkflow from "./workflows/find_review_workflow.ts";
import SampleWorkflow from "./workflows/sample_workflow.ts";
// Datastores
import SampleObjectDatastore from "./datastores/sample_datastore.ts";
import ModulesDatastore from "./datastores/modules_datastore.ts";
import ReviewsDatastore from "./datastores/reviews_datastore.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "repl-plus",
  description: "A template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  workflows: [
    DashboardWorkflow,
    CreateReviewWorkflow,
    EditReviewWorkflow,
    FindReviewWorkflow,
    SampleWorkflow,
  ],
  outgoingDomains: [],
  datastores: [
    SampleObjectDatastore,
    ModulesDatastore,
    ReviewsDatastore
  ],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
