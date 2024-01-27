import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";

import {
  CONTENT_ACTION_ID,
  CONTENT_ID,
  DIFFICULTY_RATING_ACTION_ID,
  DIFFICULTY_RATING_ID,
  LEARNING_RATING_ACTION_ID,
  LEARNING_RATING_ID,
  LIMIT_QUERY_REVIEWS,
  MODULE_ACTION_ID,
  MODULE_ID,
  QUALITY_RATING_ACTION_ID,
  QUALITY_RATING_ID,
  TIME_RATING_ACTION_ID,
  TIME_RATING_ID,
  TITLE_ACTION_ID,
  TITLE_ID,
} from "../constants.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import {
  dashboardNavBlocks,
  dashboardPaginationBlocks,
  dashboardReviewsBlock,
} from "../../../blocks/dashboard.ts";
import { ReviewEntry } from "../../../types/review_entry.ts";
import { createReviewFormBlocks } from "./create_review_form.ts";
import ModulesDatastore from "../../../datastores/modules_datastore.ts";
import { Module } from "../../../types/module.ts";

export const CreateReview: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ body, client, action }) => {
  const entry = createReviewEntry(body);

  const blocks = [];

  const validation = validateEntry(entry);

  if (!validation.pass) {
    blocks.push(
      ...createReviewFormBlocks(
        parseToTypeModule(JSON.parse(action.value)),
        validation.entry,
      ),
    );
  } // passed validation
  else {
    const blocks = [];
  }

  // update message block
  const msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks,
  });

  // handle error
  if (!msgUpdate.ok) {
    const errorMsg = `Error during chat.update!", ${msgUpdate.error}`;
    return { error: errorMsg };
  }

  //   const blocks = [];

  //   const m = ["1", "2", "3", "4", "5"];
  //   const q = ["1", "2", "3", "4", "5"];
  //   const d = ["1", "2", "3", "4", "5"];
  //   const t = ["1", "2", "3", "4", "5"];
  //   const l = ["1", "2", "3", "4", "5"];

  //   blocks.push(
  //     ...createReviewFormBlocks(m, q, d, t, l),
  //   );

  //   blocks.push({ type: "divider" });

  //   // update message block
  //   const msgUpdate = await client.chat.update({
  //     channel: body.container.channel_id,
  //     ts: body.container.message_ts,
  //     blocks,
  //   });

  //   // handle error
  //   if (!msgUpdate.ok) {
  //     const errorMsg = `Error during chat.update!", ${msgUpdate.error}`;
  //     console.log(errorMsg);
  //     return { error: errorMsg };
  //   }
  // } else {
  //   // Call the API
  //   const res = await client.apps.datastore.put<
  //     typeof ReviewsDatastore.definition
  //   >({
  //     datastore: ReviewsDatastore.name,
  //     item: {
  //       id: crypto.randomUUID(),
  //       module_id: String(module),
  //       user_id: body.user.id,
  //       review: String(content),
  //       time_consumption: Number(time),
  //       rating_quality: Number(quality),
  //       rating_difficulty: Number(difficulty),
  //       rating_learning: Number(learning),
  //       created_at: Date.now(),
  //       updated_at: Date.now(),
  //     },
  //   });

  //   // handle API error
  //   if (!res.ok) {
  //     const queryErrorMsg =
  //       `Error accessing reviews datastore (Error detail: ${res.error})`;
  //     return { error: queryErrorMsg };
  //   }
  //   // query reviews
  //   const queryResponse = await client.apps.datastore.query<
  //     typeof ReviewsDatastore.definition
  //   >({
  //     datastore: ReviewsDatastore.name,
  //     limit: LIMIT_QUERY_REVIEWS,
  //   });

  //   // handle error
  //   if (!queryResponse.ok) {
  //     const queryErrorMsg =
  //       `Error querying reviews (Error detail: ${queryResponse.error})`;
  //     return { error: queryErrorMsg };
  //   }

  //   const blocks = [];

  //   // add blocks from dashboardNavBlocks
  //   blocks.push(...dashboardNavBlocks());
  //   blocks.push({ type: "divider" });

  //   // add blocks from dashboardReviewsBlock
  //   blocks.push(...dashboardReviewsBlock(queryResponse.items));
  //   blocks.push({ type: "divider" });

  //   // add blocks from dashboardPaginationBlocks
  //   blocks.push(
  //     dashboardPaginationBlocks(
  //       queryResponse.response_metadata?.next_cursor,
  //     ),
  //   );

  //   // update message block
  //   const msgUpdate = await client.chat.update({
  //     channel: body.container.channel_id,
  //     ts: body.container.message_ts,
  //     blocks,
  //   });

  //   // handle error
  //   if (!msgUpdate.ok) {
  //     const errorMsg = `Error during chat.update!", ${msgUpdate.error}`;
  //     return { error: errorMsg };
  //   }
  // }
};

function validateEntry(entry: ReviewEntry) {
  let pass = true;

  if (entry.title === "") pass = false;
  if (entry.content === "") pass = false;

  for (const key in entry) {
    if (entry[key as keyof ReviewEntry] === undefined) {
      entry[key as keyof ReviewEntry] = null;
      pass = false;
    }
  }

  return { pass, entry };
}

function parseToTypeModule(
  // deno-lint-ignore no-explicit-any
  modules: any[],
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

// deno-lint-ignore no-explicit-any
function createReviewEntry(body: any): ReviewEntry {
  return {
    module: body.state.values?.[MODULE_ID]
      ?.[MODULE_ACTION_ID]
      ?.selected_option?.value,

    quality: body.state.values?.[QUALITY_RATING_ID]
      ?.[QUALITY_RATING_ACTION_ID]
      ?.selected_option?.value,

    difficulty: body.state.values
      ?.[DIFFICULTY_RATING_ID]
      ?.[DIFFICULTY_RATING_ACTION_ID]
      ?.selected_option?.value,

    time: body.state.values?.[TIME_RATING_ID]
      ?.[TIME_RATING_ACTION_ID]
      ?.selected_option?.value,

    learning: body.state.values?.[LEARNING_RATING_ID]
      ?.[LEARNING_RATING_ACTION_ID]
      ?.selected_option?.value,

    title: body.state.values?.[TITLE_ID]
      ?.[TITLE_ACTION_ID]
      ?.value,

    content: body.state.values?.[CONTENT_ID]
      ?.[CONTENT_ACTION_ID]
      ?.value,
  };
}
