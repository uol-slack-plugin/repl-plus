import { SlackAPIClient } from "deno-slack-api/types.ts";
import { generateEditMenuBlocks } from "../../../blocks/edit_menu.ts";
import { Review } from "../../../types/classes/review.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import { fetchReviews } from "../../../datastores/functions.ts";
import { userIdExpression } from "../../../datastores/expressions.ts";

export default async function EditMenuController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
  userId: string,
) {
  // Check if metadata is a valid object
  if (!metadata || typeof metadata !== 'object') {
    throw new Error('Invalid metadata');
  }

  // Check if client and updateMessage are valid objects
  if (!client || typeof client !== 'object' || !updateMessage || typeof updateMessage !== 'object') {
    throw new Error('Invalid client or updateMessage');
  }

  // Check if modules is a valid array
  if (!Array.isArray(modules)) {
    throw new Error('Invalid modules');
  }

  // Check if userId is a valid string
  if (typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }

  // Query user reviews
  const res = await fetchReviews(client, userIdExpression(userId));
  if (!res || !res.ok) {
    throw new Error('Error fetching user reviews');
  }

  // Check if user has written reviews
  const userReviews: Review[] = Review.constructReviews(res.items);
  if (userReviews.length === 0){
    throw new Error ("Looks like you haven't written a review yet! 📝 Feel free to share your thoughts whenever you're ready.")
  }

  // Generate blocks
  const blocks = generateEditMenuBlocks(
    metadata,
    userReviews,
    modules,
  );

  // Update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });

  if (!msgUpdate || !msgUpdate.ok) {
    throw new Error('Error updating message block');
  }
}
