import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import {
  BACK,
  EDIT,
  EDIT_MENU,
  NEXT_RESULTS,
  PREVIOUS_RESULTS,
  READ,
  SUBMIT,
} from "./constants.ts";
import { Back } from "./handlers/buttons/back.ts";
import { Read } from "./handlers/buttons/read.ts";
import { Edit } from "./handlers/buttons/edit.ts";
import { NextResults } from "./handlers/buttons/next_results.ts";
import { PreviousResults } from "./handlers/buttons/previous_results.ts";
import Init from "./controllers/init.ts";
import { Submit } from "./handlers/buttons/submit.ts";
import { EditMenu } from "./handlers/buttons/edit_menu.ts";

export default SlackFunction(
  GenerateDashboardDefinition,
  async ({ inputs, client }) => {
    await Init(client, inputs.user_id);
    return { completed: false };
  },
).addBlockActionsHandler(
  EDIT,
  Edit,
).addBlockActionsHandler(
  BACK,
  Back,
).addBlockActionsHandler(
  READ,
  Read,
).addBlockActionsHandler(
  NEXT_RESULTS,
  NextResults,
).addBlockActionsHandler(
  PREVIOUS_RESULTS,
  PreviousResults,
).addBlockActionsHandler(
  EDIT_MENU,
  EditMenu,
).addBlockActionsHandler(
  SUBMIT,
  Submit,
);
