import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import { SEARCH_REVIEWS } from "../../constants.ts";
import SearchFormController from "../../controllers/search_form.ts";
import { isMetadata } from "../../../../utils/type_guards.ts";

export const SearchReviewsButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  console.log("SearchReviewsButton");
  const metadata: unknown = JSON.parse(action.value);
  const modules = body.function_data.inputs.modules;
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  if (isMetadata(metadata)) {
    // update metadata
    metadata.pages.push(SEARCH_REVIEWS);
    metadata.cursors.pop();

    const process = await SearchFormController(
      metadata,
      client,
      updateMessage,
      modules,
    );

    if (process?.error) return process.error;
  } else return { error: "SearchReviewsButton:: Invalid metadata" };
};
