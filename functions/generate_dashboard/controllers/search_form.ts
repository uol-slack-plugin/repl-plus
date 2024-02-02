import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { Module } from "../../../types/module.ts";
import { handleChatError } from "../../../utils/errors.ts";
import { generateSearchFormBlocks } from "../../../blocks/search_form.ts";

export default async function SearchFormController(
  metadata: Metadata,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
) {
  // generate blocks
  const blocks = generateSearchFormBlocks(
    metadata,
    modules,
  );

  // update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });
  if (!msgUpdate.ok) return handleChatError(msgUpdate);
}
