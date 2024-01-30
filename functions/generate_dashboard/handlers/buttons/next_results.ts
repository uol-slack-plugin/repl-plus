import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import { DASHBOARD, EDIT_MENU } from "../../constants.ts";
import DashboardController from "../../controllers/dashboard.ts";
import EditMenuController from "../../controllers/edit_menu.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";

export const NextResults: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  console.log("NextResults::", metadata);

  if (metadata.pages[metadata.pages.length - 1] === DASHBOARD) {
    await DashboardController(metadata, client, updateMessage);
  }

  if (metadata.pages[metadata.pages.length - 1] === EDIT_MENU) {
    await EditMenuController(
      metadata,
      client,
      updateMessage,
    );
  }
};
