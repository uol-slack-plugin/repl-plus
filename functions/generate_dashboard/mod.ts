import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";
import {
  dashboardNavBlocks,
  dashboardPaginationBlocks,
  dashboardReviewsBlock,
} from "../../blocks/dashboard.ts";
import { NEXT_PAGINATION_RESULTS } from "./constants.ts";
import { NextPaginationResults } from "./handler.ts";

export default SlackFunction(
  GenerateDashboardDefinition,
  async ({ inputs, env, client }) => {

    // get reviews
    const res = await client.apps.datastore.query<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      limit: 3,
    });

    // handle error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }

    const blocks = [];

    // add blocks from dashboardNavBlocks
    blocks.push({ ...dashboardNavBlocks(env) });
    blocks.push({ type: "divider" });

    // add blocks from dashboardReviewsBlock
    blocks.push(...dashboardReviewsBlock(res.items));
    blocks.push({ type: "divider" });

    // add blocks from dashboardPaginationBlocks
    blocks.push(
      dashboardPaginationBlocks(
        NEXT_PAGINATION_RESULTS,
        res.response_metadata?.next_cursor,
      ),
    );

    // create message
    const msgPostMessage = await client.chat.postMessage({
      channel: inputs.user_id,
      blocks,
    });

    // handle error
    if (!msgPostMessage.ok){
      const queryErrorMsg =
        `Error when sending message client.chat.postMessage (Error detail: ${msgPostMessage.error})`;
      return { error: queryErrorMsg };
    }

    return { completed: false };
  },
).addBlockActionsHandler(
  NEXT_PAGINATION_RESULTS, 
  NextPaginationResults
);
