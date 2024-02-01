import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import DashboardController from "../../controllers/dashboard.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { DASHBOARD } from "../../constants.ts";
import { separateString } from "../../../../utils/regular_expressions.ts";
import { isMetadata } from "../../../../utils/type_guards.ts";
import DeleteReviewController from "../../controllers/delete_review.ts";

export const DeleteButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const modules = body.function_data.inputs.modules;
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  // get metadata and reviewId
  let metadata: unknown;
  let reviewId: unknown;
  const result = separateString(action.value);
  if (result === null) 
    return { error:"Error: DeleteButton::separateString() cannot be null"};
  else {
    metadata = result.object;
    reviewId = result.stringPart;
  }

  // Check if metadata is of type Metadata and reviewId is a string
  if (isMetadata(metadata) && typeof reviewId === "string") {
    console.log("DeleteButton::", metadata);
    const process1 = await DeleteReviewController(client,reviewId);
    if (process1?.error) return process1.error;
    metadata.pages = [DASHBOARD];
    metadata.cursors = [];
    console.log("DeleteButton::Next::", metadata);
    const process2 = await DashboardController(
      metadata,
      client,
      updateMessage,
      modules)
    if (process2?.error) return process2.error;
  }
};
