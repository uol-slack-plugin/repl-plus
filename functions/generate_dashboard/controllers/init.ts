import { SlackAPIClient } from "deno-slack-api/types.ts";
import { generateDashboardBlocks } from "../../../blocks/dashboard.ts";
import { queryReviewDatastore } from "../../../datastores/functions.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/review.ts";
import { DASHBOARD } from "../constants.ts";
import { Module } from "../../../types/module.ts";

export default async function Init(
  client: SlackAPIClient,
  modules: Module[],
  userId: string,
) {
  const metadata: Metadata = {
    pages: [DASHBOARD],
    cursors: [],
    expression: undefined,
  };

  // query reviews
  const reviewsResponse = await queryReviewDatastore(
    client,
    metadata.cursors[metadata.cursors.length - 1],
  );

  // handle error
  if (!reviewsResponse.ok) {
    const queryErrorMsg =
      `Error accessing reviews datastore (Error detail: ${reviewsResponse.error})`;
    return { error: queryErrorMsg };
  }

  // store cursor
  metadata.cursors.push(reviewsResponse.response_metadata?.next_cursor);

  // generate blocks
  const blocks = generateDashboardBlocks(
    metadata,
    modules,
    Review.constructReviewsFromDatastore(reviewsResponse.items),
  );

  // create message
  const msgPostMessage = await client.chat.postMessage({
    channel: userId,
    blocks,
  });

  // handle error
  if (!msgPostMessage.ok) {
    const errorMsg =
      `Error when sending message client.chat.postMessage (Error detail: ${msgPostMessage.error})`;
    return { error: errorMsg };
  }
}
