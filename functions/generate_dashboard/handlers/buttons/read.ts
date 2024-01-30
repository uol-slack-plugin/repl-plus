import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import ReadController from "../../controllers/read.ts";
import { Metadata } from "../../../../types/metadata.ts";
import { READ } from "../../constants.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";

export const Read: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  // metadata
  const metadata: Metadata = JSON.parse(action.value);
  metadata.pages.push(READ);
  metadata.cursors.pop();
  console.log("ReadReview::", metadata);

  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };


  await ReadController(
    metadata,
    client,
    metadata.payload.reviewId,
    body.user.id,
    updateMessage,
  );
};
