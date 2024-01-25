import { Manifest } from "deno-slack-sdk/mod.ts";

// Workflows
import DashboardWorkflow from "./workflows/dashboard_workflow.ts";
import CreateReviewWorkflow from "./workflows/create_review_workflow.ts";
import EditReviewWorkflow from "./workflows/edit_review_workflow.ts";
import FindReviewWorkflow from "./workflows/find_review_workflow.ts";

// Datastores
import ModulesDatastore from "./datastores/modules_datastore.ts";
import ReviewsDatastore from "./datastores/reviews_datastore.ts";

// Functions
import { GetUserReviewsDefinition } from "./functions/api_operations/get_user_reviews.ts";
import { GetModulesDefinition } from "./functions/api_operations/get_modules.ts";
import { FilterUserModulesDefinition } from "./functions/logic_handlers/filter_user_modules.ts";
import { CreateReviewDefinition } from "./functions/api_operations/create_review.ts"
import { FindModuleIdDefinition } from "./functions/logic_handlers/find_module_id.ts";

// Types
import { Module } from "./types/module.ts";
import { Review } from "./types/review.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "REPL Plus",
  description:
    `REPL Plus allows you to find and create reviews for the University of London Online Computer Science course.`,
  icon: "assets/logo.jpg",
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
    Module,
    Review
  ],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
  functions:[
    GetUserReviewsDefinition,
    GetModulesDefinition,
    FindModuleIdDefinition,
    CreateReviewDefinition,
    FilterUserModulesDefinition,
  ],
  features: {
    appHome: {
      messagesTabEnabled: true,
      messagesTabReadOnlyEnabled: false,
    },
  },
});
