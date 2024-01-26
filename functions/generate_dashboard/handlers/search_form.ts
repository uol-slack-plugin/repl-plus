import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { searchFormBlocks } from "../../../blocks/search_form.ts";
import ModulesDatastore from "../../../datastores/modules_datastore.ts";

export const SearchForm: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body }) => {
  // call the API
  const queryResponse = await client.apps.datastore.query<
    typeof ModulesDatastore.definition
  >({
    datastore: ModulesDatastore.name,
  });

  // handle error
  if (!queryResponse.ok) {
    const queryErrorMsg =
      `Error querying modules datastore (Error detail: ${queryResponse.error})`;
    return { error: queryErrorMsg };
  }

  const blocks = [];

  blocks.push(
    ...searchFormBlocks(queryResponse.items),
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
