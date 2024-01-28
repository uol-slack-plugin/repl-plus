import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { Module } from "../../../types/module.ts";
import { queryDatastoresAndFilterUserModules } from "../../../datastores/functions.ts";
import { generateReviewEntryFormBlocks } from "../../../blocks/main.ts";

export const CreateReviewForm: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body }) => {
  // API call
  const queryResponse = await queryDatastoresAndFilterUserModules(
    client,
    body.user.id,
  );

  // handle error
  if (!queryResponse.ok) {
    const queryErrorMsg =
      `Error accessing modules datastore (Error detail: ${queryResponse.error})`;
    return { error: queryErrorMsg };
  }

  // create blocks
  const blocks = generateReviewEntryFormBlocks(
    "Create a review",
    Module.constructModulesFromDatastore(queryResponse.modulesNotReviewed),
  );

  // update message block
  const msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks,
  });

  // handle error
  if (!msgUpdate.ok) {
    const errorMsg = `Error during chat.update!", ${msgUpdate.error}`;
    console.log(errorMsg);
    return { error: errorMsg };
  }
};
