import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import {
  dashboardNavBlocks,
  dashboardPaginationBlocks,
  dashboardReviewsBlock,
} from "../../../blocks/dashboard.ts";
import { LIMIT_QUERY_REVIEWS } from "../constants.ts";

export const NextPaginationResults: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action, env }) => {
  // query reviews
  const queryResponse = await client.apps.datastore.query<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
    limit: LIMIT_QUERY_REVIEWS,
    cursor: action.value,
  });

  // handle error
  if (!queryResponse.ok) {
    const queryErrorMsg =
      `Error querying reviews (Error detail: ${queryResponse.error})`;
    return { error: queryErrorMsg };
  }

  const blocks = [];

  // add blocks from dashboardNavBlocks
  blocks.push(...dashboardNavBlocks(env));
  blocks.push({ type: "divider" });

  // add blocks from dashboardReviewsBlock
  blocks.push(...dashboardReviewsBlock(queryResponse.items));
  blocks.push({ type: "divider" });

  // add blocks from dashboardPaginationBlocks
  blocks.push(
    dashboardPaginationBlocks(
      queryResponse.response_metadata?.next_cursor,
    ),
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
