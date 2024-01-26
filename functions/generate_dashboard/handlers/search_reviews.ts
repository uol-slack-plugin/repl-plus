import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { SELECT_MOD_A_ID, SELECT_MOD_B_ID } from "../constants.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import {
  dashboardNavBlocks,
  dashboardPaginationBlocks,
  dashboardReviewsBlock,
} from "../../../blocks/dashboard.ts";

export const SearchReviews: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ body, client }) => {
  const moduleID = body.state.values?.[SELECT_MOD_B_ID]?.[SELECT_MOD_A_ID]
    ?.selected_option?.value;

  // call the API
  const res = await client.apps.datastore.query<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
    expression: "#module_id = :module_id",
    expression_attributes: { "#module_id": "module_id" },
    expression_values: { ":module_id": String(moduleID) },
  });

  // handle error
  if (!res.ok) {
    const queryErrorMsg =
      `Error accessing reviews datastore (Error detail: ${res.error})`;
    return { error: queryErrorMsg };
  }

  console.log(res.items);

  const blocks = [];

  // add blocks from dashboardNavBlocks
  blocks.push(...dashboardNavBlocks());
  blocks.push({ type: "divider" });

  // add blocks from dashboardReviewsBlock
  blocks.push(...dashboardReviewsBlock(res?.items));
  blocks.push({ type: "divider" });

  // add blocks from dashboardPaginationBlocks
  blocks.push(
    dashboardPaginationBlocks(
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
    const errorMsg = `Error during chat.update!", ${msgUpdate.error}`;
    console.log(errorMsg);
    return { error: errorMsg };
  }
};
