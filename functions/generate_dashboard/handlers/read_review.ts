import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
// BLOCKS
import { readReviewBlocks } from "../../../blocks/read_review.ts";
// CONSTANTS
import { DELETE_REVIEW } from "../constants.ts";

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

  const blocks = [];

  // add blocks from readReviewBlocks
  blocks.push(...readReviewBlocks(getResponse.item,DELETE_REVIEW));

  // update message block
  const msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks,
  });

  // handle error
  if (!msgUpdate.ok) {
    const errorMsg =`Error during chat.update!", ${msgUpdate.error}`;
    return { error: errorMsg };
  }
};
