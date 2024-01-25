import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import { readReviewBlocks } from "../../../blocks/read_review.ts";

export const ReadReview: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  // call the API
  const res = await client.apps.datastore.get<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
    id: action.value,
  });

  // handle error
  if (!res.ok) {
    const queryErrorMsg =
      `Error accessing modules datastore (Error detail: ${res.error})`;
    return { error: queryErrorMsg };
  }

  const blocks = [];

  // add blocks from readReviewBlocks
  blocks.push(...readReviewBlocks(res.item));

  // update message block
  const msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks,
  });

  // handle error
  if (!msgUpdate.ok) {
    console.log("Error during chat.update!", msgUpdate.error);
  }
};
