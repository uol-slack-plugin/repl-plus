import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { generateReadBlocks } from "../../../blocks/read.ts";
import { Review } from "../../../types/classes/review.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import { handleChatError, handleResError } from "../../../utils/errors.ts";
import { fetchReview, fetchVote } from "../../../datastores/functions.ts";
import { voteExpression } from "../../../datastores/expressions.ts";

export default async function ReadReviewController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
  userId: string,
  reviewId: string,
  error?: string,
) {
  // get review
  const res = await fetchReview(client, reviewId);
  if (!res.ok) {
    return handleResError(res, "ReadReviewController::Error at fetchReview()");
  }

  // check if user voted
  const queryRes = await fetchVote(
    client,
    voteExpression(userId, reviewId),
  );
  if (!queryRes.ok) handleResError(queryRes, "VoteController::fetchVote");
  const showVoteForm: boolean = queryRes.items.length === 0;

  // generate blocks
  const review: Review = Review.constructReview(res.item);
  const blocks = generateReadBlocks(
    metadata,
    modules,
    review,
    userId,
    showVoteForm,
    error,
  );

  // update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });
  if (!msgUpdate.ok) return handleChatError(msgUpdate);
}
