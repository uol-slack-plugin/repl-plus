import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import DashboardController from "../../controllers/dashboard.ts";
import { DASHBOARD, EDIT_MENU } from "../../constants.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import EditMenuController from "../../controllers/edit_menu.ts";
import { Module } from "../../../../types/module.ts";

export const PreviousResultsButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  const modules: Module[] = body.function_data.inputs.modules;
  const userId: string = body.user.id;
  const lastPage: string = metadata.pages[metadata.pages.length - 1];
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  metadata.cursors.pop();
  metadata.cursors.pop();
  console.log("PreviousResultsButton::", metadata);

  if (lastPage === DASHBOARD) {
    await DashboardController(
      metadata,
      client,
      updateMessage,
      modules,
    );
  }

  if (lastPage === EDIT_MENU) {
    await EditMenuController(
      metadata,
      client,
      updateMessage,
      modules,
      userId,
    );
  }
};
