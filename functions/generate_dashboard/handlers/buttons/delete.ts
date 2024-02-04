import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import DashboardController from "../../controllers/dashboard.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { DASHBOARD } from "../../constants.ts";
import { separateString } from "../../../../utils/regular_expressions.ts";
import { isMetadata } from "../../../../utils/type_guards.ts";
import DeleteReviewController from "../../controllers/delete_review.ts";
import { Module } from "../../../../types/module.ts";
import { Alert } from "../../../../types/alert.ts";

export const DeleteButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  // Validate inputs
  if (!client || !body || !action) {
    throw new Error(
      "Invalid inputs: client, body, or action is null or undefined",
    );
  }

  const modules: Module[] = body.function_data.inputs.modules;
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  // Get metadata and reviewId
  let metadata: unknown;
  let reviewId: unknown;
  const result = separateString(action.value);
  if (result === null) {
    return {
      error: "Error: DeleteButton::separateString() result cannot be null",
    };
  } else {
    metadata = result.object;
    reviewId = result.stringPart;
  }

  // validate metadata and reviewId
  if (!isMetadata(metadata)) {
    throw new Error("Invalid metadata");
  }
  if (typeof reviewId !== "string") {
    throw new Error("Invalid reviewId: Expected string type");
  }

  console.log("DeleteButton::", metadata);

  try {
    await DeleteReviewController(client, reviewId);

    metadata.pages = [DASHBOARD];
    metadata.cursors = [];
    console.log("DeleteButton::Next::", metadata);
    const successAlert: Alert = {
      success:
        "Your review has been removed from our records. 🌧️ We appreciate your feedback, but it seems it's no longer available. 🗑️ Thank you for sharing your thoughts with us.",
    };
    await DashboardController(
      metadata,
      client,
      updateMessage,
      modules,
      successAlert,
    );
  } catch (error) {
    console.log(error);
    const errorAlert: Alert = {
      error: error.message,
    };
    metadata.pages = [DASHBOARD];
    metadata.cursors = [];
    await DashboardController(
      metadata,
      client,
      updateMessage,
      modules,
      errorAlert,
    );
  }
};
