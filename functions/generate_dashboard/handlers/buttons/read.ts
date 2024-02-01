import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import { READ } from "../../constants.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { separateString } from "../../../../utils/regular_expressions.ts";
import { Module } from "../../../../types/module.ts";
import ReadReviewController from "../../controllers/read_review.ts";

export const ReadButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const result = separateString(action.value);
  if (result === null) return { error: "Failed to separate string" };

  const metadata: Metadata = result.object as Metadata;
  const reviewId: string = result.stringPart;
  const modules: Module[] = body.function_data.inputs.modules;
  const userId = body.user.id;
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  metadata.pages.push(READ);
  metadata.cursors.pop();
  console.log("ReadButton::", metadata);

  await ReadReviewController(
    metadata,
    client,
    updateMessage,
    modules,
    userId,
    reviewId,
  );
};
