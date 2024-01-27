import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import ModulesDatastore from "../../../datastores/modules_datastore.ts";
import { difficultyRating, rating, timeRating } from "../../../types/rating.ts";
import { DatastoreItem } from "deno-slack-api/types.ts";
import { ReviewEntry } from "../../../types/review_entry.ts";
import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { DatastoreQueryResponse } from "deno-slack-api/typed-method-types/apps.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";

import {
  generateInput,
  generateSelectType1,
  generateSelectType2,
  header,
  info,
  submitAndCancelButtons,
  validationAlert,
} from "../../../blocks/review_form.ts";

import {
  CANCEL_BUTTON,
  CONTENT_ACTION_ID,
  CONTENT_ID,
  CREATE_REVIEW_SUBMIT,
  DIFFICULTY_RATING_ACTION_ID,
  DIFFICULTY_RATING_ID,
  LEARNING_RATING_ACTION_ID,
  LEARNING_RATING_ID,
  MODULE_ACTION_ID,
  MODULE_ID,
  QUALITY_RATING_ACTION_ID,
  QUALITY_RATING_ID,
  TIME_RATING_ACTION_ID,
  TIME_RATING_ID,
  TITLE_ACTION_ID,
  TITLE_ID,
} from "../constants.ts";
import { Module } from "../../../types/module.ts";

export const CreateReviewForm: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body }) => {
  
  // API call
  const res = await queryDatastoresAndFilterUserModules(client, body.user.id);

  // handle error
  if (!res.ok) {
    const queryErrorMsg =
      `Error accessing modules datastore (Error detail: ${res.error})`;
    return { error: queryErrorMsg };
  }

  // create blocks
  const blocks = createReviewFormBlocks(parseToTypeModule(res.modulesNotReviewed));

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

function parseToTypeModule(
  modules: DatastoreItem<typeof ModulesDatastore.definition>[],
): Module[] {
  const parsedModules: Module[] = [];

  modules.forEach((moduleItem) => {
    const parsedModule: Module = {
      id: moduleItem.id,
      code: moduleItem.code,
      name: moduleItem.name,
      rating: moduleItem.rating,
    };

    parsedModules.push(parsedModule);
  });
  return parsedModules;
}

async function queryDatastoresAndFilterUserModules(
  client: SlackAPIClient,
  userId: string,
): Promise<{
  ok: boolean;
  modulesNotReviewed: DatastoreItem<typeof ModulesDatastore.definition>[];
  error?: string;
}> {
  const modulesNotReviewed: DatastoreItem<
    typeof ModulesDatastore.definition
  >[] = [];

  // query modules
  const modules: DatastoreQueryResponse<typeof ModulesDatastore.definition> =
    await client.apps.datastore.query<typeof ModulesDatastore.definition>({
      datastore: ModulesDatastore.name,
    });

  if (!modules.ok) {
    return { ok: false, modulesNotReviewed, error: modules.error };
  }

  // query reviews
  const userReviews: DatastoreQueryResponse<
    typeof ReviewsDatastore.definition
  > = await client.apps.datastore.query<typeof ReviewsDatastore.definition>({
    datastore: ReviewsDatastore.name,
    expression: "#user_id = :user_id",
    expression_attributes: { "#user_id": "user_id" },
    expression_values: { ":user_id": userId },
  });

  if (!userReviews.ok) {
    return { ok: false, modulesNotReviewed, error: modules.error };
  }

  // filter user modules, compare ids and get non matching objects
  modulesNotReviewed.push(
    ...modules.items.filter((
      m: DatastoreItem<typeof ModulesDatastore.definition>,
    ) =>
      !userReviews.items.some((
        r: DatastoreItem<typeof ReviewsDatastore.definition>,
      ) => m.id === r.module_id)
    ).filter((m) => m.name),
  );

  return { ok: true, modulesNotReviewed };
}

export const createReviewFormBlocks = (
  modules: Module[],
  status: ReviewEntry | undefined = undefined,
) => {
  const blocks = [];

  blocks.push(...header("Create a review"));

  blocks.push(
    ...generateSelectType2(
      "Pick a course that you'd like to share thoughts on",
      "Select a module",
      modules,
      MODULE_ID,
      MODULE_ACTION_ID,
    ),
  );

  if (status?.module === null) blocks.push(...validationAlert());

  blocks.push(...info());

  blocks.push(
    ...generateSelectType1(
      "Quality?",
      "Rate Quality",
      rating,
      QUALITY_RATING_ID,
      QUALITY_RATING_ACTION_ID,
    ),
  );

  if (status?.quality === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateSelectType1(
      "Difficulty?",
      "Rate Difficulty",
      difficultyRating,
      DIFFICULTY_RATING_ID,
      DIFFICULTY_RATING_ACTION_ID,
    ),
  );

  if (status?.difficulty === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateSelectType1(
      "Learning?",
      "Rate Learning",
      rating,
      LEARNING_RATING_ID,
      LEARNING_RATING_ACTION_ID,
    ),
  );

  if (status?.learning === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateSelectType2(
      "How much time did you spend on this module?",
      "Select an item",
      timeRating,
      TIME_RATING_ID,
      TIME_RATING_ACTION_ID,
    ),
  );

  if (status?.time === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateInput("Title", false, TITLE_ID, TITLE_ACTION_ID),
  );

  if (status?.title === null) blocks.push(...validationAlert());

  blocks.push(
    ...generateInput(
      "What are your thoughts on this course?",
      true,
      CONTENT_ID,
      CONTENT_ACTION_ID,
    ),
  );

  if (status?.content === null) blocks.push(...validationAlert());

  blocks.push(
    ...submitAndCancelButtons(CANCEL_BUTTON, CREATE_REVIEW_SUBMIT, modules),
  );

  return blocks;
};
