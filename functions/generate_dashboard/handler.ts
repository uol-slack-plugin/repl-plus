import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";
import {
  dashboardNavBlocks,
  dashboardPaginationBlocks,
  dashboardReviewsBlock,
} from "../../blocks/dashboard.ts";
import { NEXT_PAGINATION_RESULTS, READ_REVIEW } from "./constants.ts";

export const NextPaginationResults: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action, env }) => {
  // get reviews
  const res = await client.apps.datastore.query<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
    limit: 3,
    cursor: action.value,
  });

  // handle error
  if (!res.ok) {
    const queryErrorMsg =
      `Error accessing reviews datastore (Error detail: ${res.error})`;
    return { error: queryErrorMsg };
  }

  const blocks = [];

  // add blocks from dashboardNavBlocks
  blocks.push(...dashboardNavBlocks(env));
  blocks.push({ type: "divider" });

  // add blocks from dashboardReviewsBlock
  blocks.push(...dashboardReviewsBlock(res.items, READ_REVIEW));
  blocks.push({ type: "divider" });

  // add blocks from dashboardPaginationBlocks
  blocks.push(
    dashboardPaginationBlocks(
      NEXT_PAGINATION_RESULTS,
      res.response_metadata?.next_cursor,
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
    console.log("Error during chat.update!", msgUpdate.error);
  }
};
