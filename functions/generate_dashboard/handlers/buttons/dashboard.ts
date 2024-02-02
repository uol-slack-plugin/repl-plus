import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import DashboardController from "../../controllers/dashboard.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { Module } from "../../../../types/module.ts";

export const DashboardButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body }) => {
  const modules: Module[] = body.function_data.inputs.modules;
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  const metadata: Metadata = {
    pages: [],
    cursors: [],
  };
  console.log("DashboardButton::", metadata);

  await DashboardController(
    metadata,
    client,
    updateMessage,
    modules,
  );
};
