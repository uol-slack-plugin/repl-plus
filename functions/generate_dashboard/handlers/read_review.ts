import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import ReadReviewController from "../controllers/read_review.ts";
import { Metadata } from "../../../types/metadata.ts";
import { READ_REVIEW } from "../constants.ts";
import { UpdateMessage } from "../../../types/update_message.ts";

export const ReadReview: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  
  // metadata
  const metadata:Metadata = JSON.parse(action.value);
  metadata.pages.push(READ_REVIEW);
  metadata.cursors.pop();
  console.log("ReadReview::", metadata);

  const updateMessage: UpdateMessage ={
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  }

  // controller
  await ReadReviewController(
    metadata,
    client,
    metadata.payload.reviewId,
    body.user.id,
    updateMessage,
  );
};
