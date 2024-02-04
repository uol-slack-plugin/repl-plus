import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/classes/review.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import { fetchReview } from "../../../datastores/functions.ts";
import { generateReadBlocks } from "../../../blocks/read.ts";

export default async function EditVoteController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
  reviewId: string,
  userId: string,
) {
  try{
    // get review
    const res = await fetchReview(client, reviewId);
    if (!res.ok) throw new Error(res.error);
  
    // generate blocks
    const review: Review = Review.constructReview(res.item);
    const blocks = generateReadBlocks(
      metadata,
      modules,
      review,
      userId,
      true,
    );
  
    // update message block
    const msgUpdate = await client.chat.update({
      channel: updateMessage.channelId,
      ts: updateMessage.messageTs,
      blocks,
    });
    if (!msgUpdate.ok) throw new Error(msgUpdate.error);
  }
  catch(error){
    const errorMsg = `Error in EditVoteController. (Error detail: ${error.msg})`;
    throw new Error(errorMsg);
  }
}
