import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import EditFormController from "../../controllers/edit_form.ts";
import { Metadata } from "../../../../types/metadata.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { EDIT } from "../../constants.ts";

export const Edit: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  metadata.pages.push(EDIT);

  console.log("Button::Edit", metadata);

  await EditFormController(
    metadata,
    client,
    updateMessage,
    body.function_data.inputs.modules,
    metadata.payload.reviewId,
  );
};
