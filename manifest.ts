import { Manifest } from "deno-slack-sdk/mod.ts";

// Workflows
import DashboardWorkflow from "./workflows/dashboard_workflow.ts";
import CreateReviewWorkflow from "./workflows/create_review_workflow.ts";
import EditReviewWorkflow from "./workflows/edit_review_workflow.ts";
import FindReviewWorkflow from "./workflows/find_review_workflow.ts";

// Datastores
import ModulesDatastore from "./datastores/modules_datastore.ts";
import ReviewsDatastore from "./datastores/reviews_datastore.ts";
// Types
import { ModulesArrayType } from "./types/modules.ts";
import { ModuleType } from "./types/modules.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "REPL Plus",
  description:
    `REPL Plus allows you to find and create reviews for the University of London Online Computer Science course.`,
  icon: "assets/final.png",
  workflows: [
    DashboardWorkflow,
    CreateReviewWorkflow,
    EditReviewWorkflow,
    FindReviewWorkflow,
  ],
  outgoingDomains: [],
  datastores: [
    ModulesDatastore,
    ReviewsDatastore,
  ],
  types: [
    ModulesArrayType,
    ModuleType,
  ],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
  features: {
    appHome: {
      messagesTabEnabled: true,
      messagesTabReadOnlyEnabled: false,
    },
  },
});
