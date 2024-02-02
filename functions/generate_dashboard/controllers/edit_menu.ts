import { SlackAPIClient } from "deno-slack-api/types.ts";
import { generateEditMenuBlocks } from "../../../blocks/edit_menu.ts";
import { Review } from "../../../types/classes/review.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import { fetchReviews } from "../../../datastores/functions.ts";
import { userIdExpression } from "../../../datastores/expressions.ts";
import { handleChatError, handleResError } from "../../../utils/errors.ts";

export default async function EditMenuController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
  userId:string,
) {
  
  // query user reviews
  const res = await fetchReviews(client,userIdExpression(userId))
  if (!res.ok) return handleResError(res,"EditMenuController::Error at fetchReviews()");

  // generate blocks
  const userReviews: Review[] = Review.constructReviews(res.items);
  const blocks = generateEditMenuBlocks(
    metadata,
    userReviews,
    modules,
  );

  // update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });
  if (!msgUpdate.ok) return handleChatError(msgUpdate);
}
