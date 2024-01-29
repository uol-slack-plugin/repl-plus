import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { queryReviewDatastore } from "../../../datastores/functions.ts";
import { Review } from "../../../types/review.ts";
import { generateDashboardBlocks } from "../../../blocks/dashboard.ts";
import { Metadata } from "../../../types/metadata.ts";

export const SearchReviewsSubmit: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ body, client }) => {
  const metadata: Metadata = {
    cursors: [],
    expression: {
      expression: "#user_id = :user_id",
      expression_attributes: { "#user_id": "user_id" },
      expression_values: { ":user_id": body.user.id },
      limit: 3,
    },
  };

  // query reviews
  const queryResponse = await queryReviewDatastore(
    client,
    undefined,
    metadata.expression,
  );

  // handle error
  if (!queryResponse.ok) {
    const queryErrorMsg =
      `Error accessing reviews datastore (Error detail: ${queryResponse.error})`;
    return { error: queryErrorMsg };
  }

  // store cursor
  metadata.cursors.push(queryResponse.response_metadata?.next_cursor);

  // generate blocks
  const blocks = generateDashboardBlocks(
    Review.constructReviewsFromDatastore(queryResponse.items),
    metadata,
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
    return { error: errorMsg };
  }
};
