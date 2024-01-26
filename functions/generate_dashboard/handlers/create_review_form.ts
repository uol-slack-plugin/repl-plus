import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { createReviewFormBlocks } from "../../../blocks/create_review_form.ts";

export const CreateReviewForm: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, }) => {

  const blocks =[];

  blocks.push(...createReviewFormBlocks())

  console.log(blocks)


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
