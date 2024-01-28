import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { queryReviewDatastore } from "../../../datastores/functions.ts";
import { generateDashboardBlocks } from "../../../blocks/dashboard.ts";
import { Review } from "../../../types/review.ts";

export const NextResults: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const cursors: string[] = JSON.parse(action.value);

  
  // query reviews
  const reviewsResponse = await queryReviewDatastore(
    client,
    cursors[cursors.length - 1],
  );

  // handle error
  if (!reviewsResponse.ok) {
    const queryErrorMsg =
    `Error accessing reviews datastore (Error detail: ${reviewsResponse.error})`;
    return { error: queryErrorMsg };
  }
  
  // update cursors
  cursors.push(reviewsResponse.response_metadata?.next_cursor);

  const blocks = generateDashboardBlocks(
    Review.constructReviewsFromDatastore(reviewsResponse.items),
    cursors,
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
