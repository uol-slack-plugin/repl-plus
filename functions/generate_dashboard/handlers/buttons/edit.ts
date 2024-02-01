import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { EDIT } from "../../constants.ts";
import { separateString } from "../../../../utils/regular_expressions.ts";
import EditReviewFormController from "../../controllers/edit_review_form.ts";

export const EditButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const result = separateString(action.value);
  if (result === null ) return {error:"Failed to separate string"}  
  
  const metadata: Metadata = result.object as Metadata;
  const reviewId = result.stringPart;
  const userId = body.user.id;
  const modules = body.function_data.inputs.modules;
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  metadata.pages.push(EDIT);
  console.log("EditButton::", metadata);

  await EditReviewFormController(
    metadata,
    client,
    updateMessage,
    modules,
    userId,
    reviewId,
  );
};
