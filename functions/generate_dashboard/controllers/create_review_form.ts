import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { generateReviewFormBlocks } from "../../../blocks/review_form.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/review.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import { handleChatError, handleResError } from "../../../utils/errors.ts";
import { userIdExpression } from "../../../datastores/expressions.ts";
import { filterModulesWithoutReviews } from "../../../utils/modules.ts";
import { fetchReviews } from "../../../datastores/functions.ts";
import { ReviewEntry } from "../../../types/review_entry.ts";

export default async function CreateReviewFormController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
  userId: string,
  state?: ReviewEntry,
) {
  // get user reviews
  const res = await fetchReviews(client,userIdExpression(userId));
  if (!res.ok) return handleResError(res,"CreateReviewFormController::Error at fetchReviews()");
  
  // filter modules not reviewed
  const userReviews = Review.constructReviews(res.items);
  const filteredModules = filterModulesWithoutReviews(modules,userReviews);

  // create blocks
  const blocks = generateReviewFormBlocks(
    metadata,
    filteredModules,
    "Create a review",
    undefined,
    state,
  );

  // update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });
  if (!msgUpdate.ok) return handleChatError(msgUpdate);
}
