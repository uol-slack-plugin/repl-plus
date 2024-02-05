import { Manifest } from "deno-slack-sdk/mod.ts";
import ReplPlusWorkflow from "./workflows/repl_plus_workflow.ts";
import ModulesDatastore from "./datastores/modules_datastore.ts";
import ReviewsDatastore from "./datastores/reviews_datastore.ts";
import VotesDatastore from "./datastores/votes_datastore.ts";
import { GenerateDashboardDefinition } from "./functions/generate_dashboard/definition.ts";
import { GetModulesDefinition } from "./functions/api_operations/get_modules.ts";
import { Modules } from "./types/custom_types/modules.ts";
import { SendMessageWorkflow } from "./workflows/send_message_workflow.ts";

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
    ReplPlusWorkflow,
    SendMessageWorkflow,
  ],
  outgoingDomains: [],
  datastores: [
    ModulesDatastore,
    ReviewsDatastore,
    VotesDatastore,
  ],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
  functions: [
    GenerateDashboardDefinition,
    GetModulesDefinition,
  ],
  types: [Modules],
  features: {
    appHome: {
      messagesTabEnabled: true,
      messagesTabReadOnlyEnabled: false,
    },
  },
});
