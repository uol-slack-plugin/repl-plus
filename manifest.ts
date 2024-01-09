import { Manifest } from "deno-slack-sdk/mod.ts";

import DashboardWorkflow from "./workflows/dashboard_workflow.ts";
import CreateReviewWorkflow from "./workflows/create_review_workflow.ts";
import EditReviewWorkflow from "./workflows/edit_review_workflow.ts";
import FindReviewWorkflow from "./workflows/find_review_workflow.ts";
import SampleWorkflow from "./workflows/sample_workflow.ts";

import SampleObjectDatastore from "./datastores/sample_datastore.ts";

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
  datastores: [SampleObjectDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
