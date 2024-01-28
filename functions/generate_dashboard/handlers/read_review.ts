import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { generateReadReviewBlocks } from "../../../blocks/main.ts";
import { Review } from "../../../types/review.ts";

export const ReadReview: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  // get review
  const getResponse = await client.apps.datastore.get<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
    id: action.value,
  });

  // handle error
  if (!getResponse.ok) {
    const queryErrorMsg =
      `Error getting review (Error detail: ${getResponse.error})`;
    return { error: queryErrorMsg };
  }

  // add blocks from readReviewBlocks
  const blocks = [
    ...generateReadReviewBlocks(
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
      body.user.id,
    ),
  ];

  // update message block
  const msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks,
  });

  // handle error
  if (!msgUpdate.ok) {
    const errorMsg = `Error during chat.update!", ${msgUpdate.error}`;
    console.log(errorMsg);
    return { error: errorMsg };
  }
};
