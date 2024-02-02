import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Module } from "../../../../types/module.ts";
import { Metadata } from "../../../../types/metadata.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { CREATE_REVIEW } from "../../constants.ts";
import CreateReviewFormController from "../../controllers/create_review_form.ts";

export const CreateReviewButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  const modules: Module[] = body.function_data.inputs.modules;
  const userId = body.user.id;

  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  // update metadata
  metadata.pages.push(CREATE_REVIEW);
  metadata.cursors.pop();

  console.log("CreateReviewButton::", metadata);

  await CreateReviewFormController(
    metadata,
    client,
    updateMessage,
    modules,
    userId,
  );
};
