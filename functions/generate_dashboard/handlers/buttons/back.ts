import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import DashboardController from "../../controllers/dashboard.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import EditMenuController from "../../controllers/edit_menu.ts";
import ReadController from "../../controllers/read.ts";
import { DASHBOARD, EDIT_MENU, READ } from "../../constants.ts";

export const Back: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };
  // update metadata
  metadata.pages.pop();
  try {
    // this stores pagination when returning to dashboard
    metadata.cursors = [...metadata.temp];
  } catch (e) {
    console.log("error no metadata.temp object", e);
  }
  console.log("Back::", metadata);

  // back to dashboard
  if (metadata.pages[metadata.pages.length - 1] === DASHBOARD) {
    metadata.payload = {};
    await DashboardController(metadata, client, updateMessage);
  }

  // back to edit menu
  if (metadata.pages[metadata.pages.length - 1] === EDIT_MENU) {
    await EditMenuController(
      metadata,
      client,
      updateMessage,
    );
  }

  // back to read page
  if (metadata.pages[metadata.pages.length - 1] === READ) {
    await ReadController(
      metadata,
      client,
      metadata.payload.reviewId,
      body.user.id,
      updateMessage,
    );
  }
};
