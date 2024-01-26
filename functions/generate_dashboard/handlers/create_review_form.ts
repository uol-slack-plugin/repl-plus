import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { createReviewFormBlocks } from "../../../blocks/create_review_form.ts";

export const CreateReviewForm: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body }) => {
  const blocks = [];

  // TESTING gotta remove
  const modules = ["1", "2", "3", "4", "5"];
  const quality = ["1", "2", "3", "4", "5"];
  const difficulty = ["1", "2", "3", "4", "5"];
  const time = ["1", "2", "3", "4", "5"];
  const learning = ["1", "2", "3", "4", "5"];

  blocks.push(
    ...createReviewFormBlocks(modules, quality, difficulty, time, learning),
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
