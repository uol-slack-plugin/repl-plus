import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { selectReviewFormBlocks } from "../../../blocks/edit_review_blocks.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import { SELECT_REVIEW_A_ID, SELECT_REVIEW_B_ID } from "../constants.ts";

export const SelectReviewForm: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body }) => {
  console.log(body);

  // Get all the user's reviews
  const reviews = await client.apps.datastore.query<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
  });

  if (!reviews.ok) {
    console.log(`Could no fetch user reviews. Error message ${reviews.error}`);
    return { error: reviews.error }; //exit somehow
  }

  const blocks = selectReviewFormBlocks(reviews.items.map((i) => i.id));

  const msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks,
  });

  // handle error
  if (!msgUpdate.ok) {
    const errorMsg = `Error during chat.update!", ${msgUpdate.error}`;
    return { error: errorMsg };
  }
};
