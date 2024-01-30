import { SlackAPIClient } from "deno-slack-api/types.ts";
import { generateEditMenuBlocks } from "../../../blocks/edit_menu.ts";
import { queryAllReviews, queryReviewDatastore } from "../../../datastores/functions.ts";
import { Review } from "../../../types/review.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";

export default async function EditMenuController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  
) {
  // query user reviews limited number
  const queryResponse = await queryReviewDatastore(
    client,
    metadata.cursors[metadata.cursors.length -1],
    metadata.expression,
  );

  // handle error
  if (!queryResponse.ok) {
    const queryErrorMsg =
      `Error accessing reviews datastore (Error detail: ${queryResponse.error})`;
    return { error: queryErrorMsg };
  }

  // query all userReviews
  const queryAllResponse = await queryAllReviews(client,metadata.expression);

  // update cursor for pagination
  metadata.cursors.push(queryResponse.response_metadata?.next_cursor);

  // generate blocks
  const blocks = generateEditMenuBlocks(
    Review.constructReviewsFromDatastore(queryAllResponse.items),
    Review.constructReviewsFromDatastore(queryResponse.items),
    metadata,
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
