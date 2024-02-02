import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { generateReviewFormBlocks } from "../../../blocks/review_form.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/classes/review.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import { handleChatError, handleResError } from "../../../utils/errors.ts";
import { userIdExpression } from "../../../datastores/expressions.ts";
import { filterModulesWithoutReviews } from "../../../utils/modules.ts";
import { fetchReview, fetchReviews } from "../../../datastores/functions.ts";

export default async function EditReviewFormController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
  userId: string,
  reviewId: string,
) {
  // get review
  const getRes = await fetchReview(client, reviewId);
  if (!(getRes).ok) return handleResError(getRes,"EditReviewFormController::Error at fetchReview()");

  // get userReviews
  const queryRes = await fetchReviews(client,userIdExpression(userId));
  if (!(queryRes).ok) return handleResError(getRes,"EditReviewFormController::Error at fetchReviews()");

  // filter modules not reviewed && add the module to be edited
  const userReviews: Review[] = Review.constructReviews(queryRes.items);
  const filteredModules: Module[] = filterModulesWithoutReviews(modules,userReviews,reviewId);

  // create blocks
  const review = Review.constructReview(getRes.item);
  const blocks = generateReviewFormBlocks(
    metadata,
    filteredModules,
    "Edit a review",
    review,
  );

  // update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });
  if (!msgUpdate.ok) return handleChatError(msgUpdate);
}
