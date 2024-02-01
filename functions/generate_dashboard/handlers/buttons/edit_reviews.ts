import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import EditMenuController from "../../controllers/edit_menu.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { EDIT_REVIEWS } from "../../constants.ts";
import { Module } from "../../../../types/module.ts";

export const EditReviewsButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ body, client, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  const modules: Module[] = body.function_data.inputs.modules;
  const userId = body.user.id;
  
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  // update metadata
  metadata.pages.push(EDIT_REVIEWS);
  metadata.cursors.pop();

  console.log("EditReviewsButton::", metadata);

  await EditMenuController(
    metadata,
    client,
    updateMessage,
    modules,
    userId,
  );
};
