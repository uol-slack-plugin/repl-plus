import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { generateDashboardBlocks } from "../../../blocks/dashboard.ts";
import { queryReviewDatastore } from "../../../datastores/functions.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/review.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";

export default async function DashboardController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[]
) {
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

  // update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });

  // handle error
  if (!msgUpdate.ok) {
    const errorMsg = `Error during chat.update!", ${msgUpdate.error}`;
    return { error: errorMsg };
  }
}
