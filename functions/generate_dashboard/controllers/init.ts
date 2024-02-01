import { DASHBOARD } from "../constants.ts";
import { SlackAPIClient } from "deno-slack-api/types.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/review.ts";
import { Module } from "../../../types/module.ts";
import { generateDashboardBlocks } from "../../../blocks/dashboard.ts";
import { handleChatError, handleResError } from "../../../utils/errors.ts";
import { fetchReviewsLimited } from "../../../datastores/functions.ts";

export default async function Init(
  client: SlackAPIClient,
  modules: Module[],
  userId: string,
) {
  const metadata: Metadata = {
    pages: [DASHBOARD],
    cursors: [],
  };

  const res = await fetchReviewsLimited(client);
  if (!res.ok) return handleResError(res, "Init::Error at fetchReviewsLimited()");

  // store cursor
  const cursor = res.response_metadata?.next_cursor;
  if (cursor !== undefined) metadata.cursors.push(cursor);

  //generate blocks
  const reviews = Review.constructReviews(res.items);
  const blocks = generateDashboardBlocks(
    metadata,
    modules,
    reviews,
  );

  //create message
  const msgPostMessage = await client.chat.postMessage({
    channel: userId,
    blocks,
  });
  if (!msgPostMessage.ok) return handleChatError(msgPostMessage);
}
