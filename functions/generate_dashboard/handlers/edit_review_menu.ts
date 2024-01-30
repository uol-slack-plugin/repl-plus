import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { Metadata } from "../../../types/metadata.ts";
import { EDIT_REVIEW_MENU } from "../constants.ts";
import EditReviewMenuController from "../controllers/edit_review_menu.ts";
import { UpdateMessage } from "../../../types/update_message.ts";

export const EditReviewMenu: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ body, client, action }) => {
  const metadata: Metadata = JSON.parse(action.value);
  metadata.pages.push(EDIT_REVIEW_MENU);
  metadata.cursors.pop();
  metadata.temp = [...metadata.cursors];
  metadata.cursors.length = 0;
  metadata.expression = {
    expression: "#user_id = :user_id",
    expression_attributes: { "#user_id": "user_id" },
    expression_values: { ":user_id": body.user.id },
  };

  const updateMessage: UpdateMessage ={
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  }

  console.log("EditReviewMenu::", metadata);

  await EditReviewMenuController(
    metadata,
    client,
    updateMessage,
  );
};
