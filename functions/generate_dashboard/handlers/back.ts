import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { queryReviewDatastore } from "../../../datastores/functions.ts";
import { generateDashboardBlocks } from "../../../blocks/main.ts";
import { Review } from "../../../types/review.ts";

export const Back: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body }) => {
  // query reviews
  const queryResponse = await queryReviewDatastore(client);

  // handle error
  if (!queryResponse.ok) {
    const queryErrorMsg =
      `Error querying reviews (Error detail: ${queryResponse.error})`;
    return { error: queryErrorMsg };
  }

  // generate blocks
  const blocks = generateDashboardBlocks(
    Review.constructReviewsFromDatastore(queryResponse.items),
    queryResponse.response_metadata?.next_cursor,
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
