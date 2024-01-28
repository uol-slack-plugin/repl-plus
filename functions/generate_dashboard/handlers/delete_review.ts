import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import { generateDashboardBlocks } from "../../../blocks/main.ts";
import { queryReviewDatastore } from "../../../datastores/functions.ts";
import { Review } from "../../../types/review.ts";

export const DeleteReview: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  // delete Review
  const deleteResponse = await client.apps.datastore.delete<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
    id: action.value,
  });

  // handle error
  if (!deleteResponse.ok) {
    const queryErrorMsg =
      `Error deleting a review (Error detail: ${deleteResponse.error})`;
    console.log(queryErrorMsg);
    return { error: queryErrorMsg };
  }

  // query reviews
  const reviewsResponse = await queryReviewDatastore(client);

  // handle error
  if (!reviewsResponse.ok) {
    const queryErrorMsg =
      `Error accessing reviews datastore (Error detail: ${reviewsResponse.error})`;
    return { error: queryErrorMsg };
  }

  // generate blocks
  const blocks = generateDashboardBlocks(
    Review.constructReviewsFromDatastore(reviewsResponse.items),
    reviewsResponse.response_metadata?.next_cursor,
  );

  // update message block
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
