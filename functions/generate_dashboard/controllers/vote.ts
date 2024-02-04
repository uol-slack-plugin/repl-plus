import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/classes/review.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import {
  createVote,
  fetchReview,
  fetchVote,
  updateReview,
  updateVote,
} from "../../../datastores/functions.ts";
import { generateReadBlocks } from "../../../blocks/read.ts";
import { voteExpression } from "../../../datastores/expressions.ts";
import { Vote } from "../../../types/vote.ts";
import { DISLIKE, LIKE } from "../constants.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";
import VotesDatastore from "../../../datastores/votes_datastore.ts";

export default async function VoteController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
  reviewId: string,
  userId: string,
  actionId: string,
): Promise<void> {
  // Validate input parameters
  if (
    !metadata || !client || !updateMessage || !modules ||
    !Array.isArray(modules) || modules.length === 0 || !reviewId || !userId ||
    !actionId
  ) {
    throw new Error(
      "Invalid input parameters: metadata, client, updateMessage, modules, reviewId, userId, and actionId are required",
    );
  }

  try {
    // Get review
    const getRes = await fetchReview(client, reviewId);
    if (!getRes.ok) throw new Error(getRes.error);

    // Get vote
    const queryRes = await fetchVote(client, voteExpression(userId, reviewId));
    if (!queryRes.ok) throw new Error(queryRes.error);

    const review: Review = Review.constructReview(getRes.item);
    const isNewVote: boolean = queryRes.items.length === 0;

    if (isNewVote) { // Create vote and update review
      const newVote: Vote = {
        id: crypto.randomUUID(),
        reviewId: reviewId,
        userId: userId,
        like: (actionId === LIKE) ? true : false,
        dislike: (actionId === DISLIKE) ? true : false,
      };

      // Update review's helpful_votes and unhelpful_votes based on new vote
      review.helpful_votes += newVote.like ? 1 : 0;
      review.unhelpful_votes += newVote.dislike ? 1 : 0;

      const putRes = await createVote(client, newVote);
      if (!putRes.ok) throw new Error(putRes.error);
    } else { // Update vote and update review
      const voteItem: DatastoreItem<typeof VotesDatastore.definition> =
        queryRes.items[0];
      const oldVote: Vote = {
        id: voteItem.id,
        reviewId: voteItem.review_id,
        userId: voteItem.user_id,
        like: voteItem.like,
        dislike: voteItem.dislike,
      };
      const updatedVote: Vote = {
        id: oldVote.id,
        reviewId: oldVote.reviewId,
        userId: oldVote.userId,
        like: (actionId === LIKE) ? true : false,
        dislike: (actionId === DISLIKE) ? true : false,
      };

      // Update review's helpful_votes and unhelpful_votes based on oldVote and updatedVote
      review.helpful_votes -= oldVote.like ? 1 : 0;
      review.unhelpful_votes -= oldVote.dislike ? 1 : 0;
      review.helpful_votes += updatedVote.like ? 1 : 0;
      review.unhelpful_votes = updatedVote.dislike ? 1 : 0;

      // Update the vote in the database
      const updateRes = await updateVote(client, updatedVote);
      if (!updateRes.ok) throw new Error(updateRes.error);
    }

    // Update review in database
    const updateReviewRes = await updateReview(client, review);
    if (!updateReviewRes.ok) throw new Error(updateReviewRes.error);

    // Generate blocks
    const blocks = generateReadBlocks(metadata, modules, review, userId, false);

    // Update message block
    const msgUpdate = await client.chat.update({
      channel: updateMessage.channelId,
      ts: updateMessage.messageTs,
      blocks,
    });
    if (!msgUpdate.ok) throw new Error(msgUpdate.error);
  } catch (error) {
    // Throw any unhandled errors
    const errorMessage =
      `Error in VoteController function (Error detail: ${error.message})`;
    throw new Error(errorMessage);
  }
}
