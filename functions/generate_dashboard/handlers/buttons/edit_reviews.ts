import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import EditMenuController from "../../controllers/edit_menu.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { EDIT_REVIEWS } from "../../constants.ts";
import { Module } from "../../../../types/module.ts";
import { isMetadata } from "../../../../utils/type_guards.ts";
import DashboardController from "../../controllers/dashboard.ts";

export const EditReviewsButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ body, client, action }) => {
  // Check if the required properties are present in the body
  if (!body || !body.user || !body.container || !body.function_data) {
    throw new Error("Invalid body structure");
  }

  // Check if the action value is a valid JSON string
  if (!action || typeof action.value !== "string") {
    throw new Error("Invalid action value");
  }

  const metadata: unknown = JSON.parse(action.value);

  // Check if the metadata is a valid object
  if (!isMetadata(metadata)) {
    throw new Error("Invalid metadata");
  }

  // Check if the modules and user ID are valid
  const modules: Module[] = body.function_data.inputs?.modules;
  const userId = body.user.id;
  if (!modules || !Array.isArray(modules) || typeof userId !== "string") {
    throw new Error("Invalid modules or user ID");
  }

  // Check if the container properties are valid
  const container = body.container;
  if (
    !container || typeof container.channel_id !== "string" ||
    typeof container.message_ts !== "string"
  ) {
    throw new Error("Invalid container properties");
  }

  const updateMessage: UpdateMessage = {
    channelId: container.channel_id,
    messageTs: container.message_ts,
  };

  try {
    await EditMenuController(
      metadata,
      client,
      updateMessage,
      modules,
      userId,
    );

    metadata.pages.push(EDIT_REVIEWS);
    metadata.cursors.pop();
    console.log("EditReviewsButton::", metadata);
  } catch (error) {
    DashboardController(
      metadata,
      client,
      updateMessage,
      modules,
      error.message,
    );
    console.log(error);
  }
};
