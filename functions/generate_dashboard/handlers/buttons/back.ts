import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import DashboardController from "../../controllers/dashboard.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import EditMenuController from "../../controllers/edit_menu.ts";
import ReadController from "../../controllers/read_review.ts";
import {
  DASHBOARD,
  EDIT_REVIEWS,
  READ,
  SEARCH_RESULTS,
  SEARCH_REVIEWS,
} from "../../constants.ts";
import { Module } from "../../../../types/module.ts";
import { separateString } from "../../../../utils/regular_expressions.ts";
import SearchFormController from "../../controllers/search_form.ts";
import SearchResultsController from "../../controllers/search_results.ts";

export const BackButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  const modules: Module[] = body.function_data.inputs.modules;
  const userId: string = body.user.id;
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  // check if there is an id in action.value
  let metadata: Metadata;
  let reviewId: string | null = null;
  const result = separateString(action.value);
  if (result === null) metadata = JSON.parse(action.value);
  else {
    metadata = result.object as Metadata;
    reviewId = result.stringPart;
  }

  // update metadata
  metadata.pages.pop();
  console.log("Back::", metadata);

  const lastPage: string = metadata.pages[metadata.pages.length - 1];
  if (lastPage === DASHBOARD) {
    await DashboardController(
      metadata,
      client,
      updateMessage,
      modules,
    );
  }
  if (lastPage === EDIT_REVIEWS) {
    await EditMenuController(
      metadata,
      client,
      updateMessage,
      modules,
      userId,
    );
  }
  if (lastPage === READ && reviewId !== null) {
    await ReadController(
      metadata,
      client,
      updateMessage,
      modules,
      userId,
      reviewId,
    );
  }
  if (lastPage === SEARCH_REVIEWS) {
    metadata.search = undefined;
    await SearchFormController(
      metadata,
      client,
      updateMessage,
      modules,
    );
  }

  if (lastPage === SEARCH_RESULTS){

    await SearchResultsController(
      metadata,
      body,
      client,
      updateMessage,
      modules
    );
  }

  if (lastPage === undefined){
    metadata.pages = [DASHBOARD];
    metadata.cursors = [];
    metadata.search = undefined;
    await DashboardController(
      metadata,
      client,
      updateMessage,
      modules,
    );
  }
};
