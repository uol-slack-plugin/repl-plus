import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { generateDashboardBlocks } from "../../../blocks/dashboard.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/classes/review.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import { fetchReviewsLimited } from "../../../datastores/functions.ts";
import { Alert } from "../../../types/alert.ts";

export default async function DashboardController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
  alert?: Alert,
): Promise<void> {
  const lastCursor = metadata.cursors[metadata.cursors.length - 1];
  const res = await fetchReviewsLimited(client, lastCursor ?? undefined);
  if (!res.ok) throw new Error(res.error);

  // store cursor
  const newCursor = res.response_metadata?.next_cursor;
  if (newCursor) metadata.cursors.push(newCursor);
  else metadata.cursors.push(null);

  // generate blocks
  const reviews = Review.constructReviews(res.items);
  const blocks = generateDashboardBlocks(
    metadata,
    modules,
    reviews,
    alert,
  );

  // update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });
  if (!msgUpdate.ok) throw new Error(msgUpdate.error);
}
