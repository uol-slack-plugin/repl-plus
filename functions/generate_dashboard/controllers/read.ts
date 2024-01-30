import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { generateReadBlocks } from "../../../blocks/read.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import { Review } from "../../../types/review.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";

export default async function ReadController(
  metadata: Metadata,
  client: SlackAPIClient,
  reviewId: string,
  userId: string,
  updateMessage: UpdateMessage,
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

  // add blocks from readReviewBlocks
  const blocks = [
    ...generateReadBlocks(
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
      ),
      userId,
      metadata
    ),
  ];

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