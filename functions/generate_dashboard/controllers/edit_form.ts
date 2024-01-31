import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { generateReviewFormBlocks } from "../../../blocks/review_form.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/review.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import { filterModulesWithoutReviews } from "../../../utils/modules.ts";

export default async function EditFormController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
 // userReviews: Review[], 
  reviewId: string,
) {
  // get review
  const getResponse = await client.apps.datastore.get<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
    id: reviewId,
  });

  // handle error
  if (!getResponse.ok) {
    const queryErrorMsg =
      `Error getting review (Error detail: ${getResponse.error})`;
    return { error: queryErrorMsg };
  }

  metadata.payload = {review: 
  new Review(
    getResponse.item.id,
    getResponse.item.user_id,
    getResponse.item.module_id,
    getResponse.item.title,
    getResponse.item.content,
    getResponse.item.time_consumption,
    getResponse.item.rating_quality,
    getResponse.item.rating_difficulty,
    getResponse.item.rating_learning,
    getResponse.item.helpful_votes,
    getResponse.item.unhelpful_votes,
    getResponse.item.created_at,
    getResponse.item.updated_at,
  )};

  // create blocks
  const blocks = generateReviewFormBlocks(
    metadata,
    "Edit a review",
    //filterModulesWithoutReviews(modules,userReviews,reviewId),
    metadata.payload.review,
  );

  // update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });

  // handle error
  if (!msgUpdate.ok) {
    const errorMsg = `Error during chat.update!", ${msgUpdate.error}`;
    console.log(errorMsg);
    return { error: errorMsg };
  }
}
