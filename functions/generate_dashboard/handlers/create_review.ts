import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";

import {
  CREATE_CONTENT_FOR_REVIEW_A_ID,
  CREATE_CONTENT_FOR_REVIEW_B_ID,
  CREATE_DIFFICULTY_RATING_FOR_REVIEW_A_ID,
  CREATE_DIFFICULTY_RATING_FOR_REVIEW_B_ID,
  CREATE_LEARNING_RATING_FOR_REVIEW_A_ID,
  CREATE_LEARNING_RATING_FOR_REVIEW_B_ID,
  CREATE_MODULE_FOR_REVIEW_A_ID,
  CREATE_MODULE_FOR_REVIEW_B_ID,
  CREATE_QUALITY_RATING_FOR_REVIEW_A_ID,
  CREATE_QUALITY_RATING_FOR_REVIEW_B_ID,
  CREATE_TIME_RATING_FOR_REVIEW_A_ID,
  CREATE_TIME_RATING_FOR_REVIEW_B_ID,
  CREATE_TITLE_FOR_REVIEW_A_ID,
  CREATE_TITLE_FOR_REVIEW_B_ID,
  LIMIT_QUERY_REVIEWS,
} from "../constants.ts";
import { createReviewFormBlocks } from "../../../blocks/create_review_form.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import {
  dashboardNavBlocks,
  dashboardPaginationBlocks,
  dashboardReviewsBlock,
} from "../../../blocks/dashboard.ts";

export const CreateReview: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ body, client }) => {
  const module = body.state.values?.[CREATE_MODULE_FOR_REVIEW_B_ID]
    ?.[CREATE_MODULE_FOR_REVIEW_A_ID]
    ?.selected_option?.value;

  const quality = body.state.values?.[CREATE_QUALITY_RATING_FOR_REVIEW_B_ID]
    ?.[CREATE_QUALITY_RATING_FOR_REVIEW_A_ID]
    ?.selected_option?.value;

  const difficulty = body.state.values
    ?.[CREATE_DIFFICULTY_RATING_FOR_REVIEW_B_ID]
    ?.[CREATE_DIFFICULTY_RATING_FOR_REVIEW_A_ID]
    ?.selected_option?.value;

  const time = body.state.values?.[CREATE_TIME_RATING_FOR_REVIEW_B_ID]
    ?.[CREATE_TIME_RATING_FOR_REVIEW_A_ID]
    ?.selected_option?.value;

  const learning = body.state.values?.[CREATE_LEARNING_RATING_FOR_REVIEW_B_ID]
    ?.[CREATE_LEARNING_RATING_FOR_REVIEW_A_ID]
    ?.selected_option?.value;

  const title = body.state.values?.[CREATE_TITLE_FOR_REVIEW_B_ID]
    ?.[CREATE_TITLE_FOR_REVIEW_A_ID]
    ?.value;

  const content = body.state.values?.[CREATE_CONTENT_FOR_REVIEW_B_ID]
    ?.[CREATE_CONTENT_FOR_REVIEW_A_ID]
    ?.value;

  if (
    typeof module === "undefined" ||
    typeof quality === "undefined" ||
    typeof difficulty === "undefined" ||
    typeof learning === "undefined" ||
    typeof time === "undefined" ||
    typeof title === "undefined" ||
    typeof content === "undefined"
  ) {
    console.log("One or more variables is undefined");

    const blocks = [];

    const m = ["1", "2", "3", "4", "5"];
    const q = ["1", "2", "3", "4", "5"];
    const d = ["1", "2", "3", "4", "5"];
    const t = ["1", "2", "3", "4", "5"];
    const l = ["1", "2", "3", "4", "5"];

    blocks.push(
      ...createReviewFormBlocks(m, q, d, t, l),
    );

    blocks.push({ type: "divider" });

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
  } else {
    // Call the API
    const res = await client.apps.datastore.put<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      item: {
        id: crypto.randomUUID(),
        module_id: String(module),
        user_id: body.user.id,
        review: String(content),
        time_consumption: Number(time),
        rating_quality: Number(quality),
        rating_difficulty: Number(difficulty),
        rating_learning: Number(learning),
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    });

    // handle API error
    if (!res.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${res.error})`;
      return { error: queryErrorMsg };
    }
    // query reviews
    const queryResponse = await client.apps.datastore.query<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      limit: LIMIT_QUERY_REVIEWS,
    });

    // handle error
    if (!queryResponse.ok) {
      const queryErrorMsg =
        `Error querying reviews (Error detail: ${queryResponse.error})`;
      return { error: queryErrorMsg };
    }

    const blocks = [];

    // add blocks from dashboardNavBlocks
    blocks.push(...dashboardNavBlocks());
    blocks.push({ type: "divider" });

    // add blocks from dashboardReviewsBlock
    blocks.push(...dashboardReviewsBlock(queryResponse.items));
    blocks.push({ type: "divider" });

    // add blocks from dashboardPaginationBlocks
    blocks.push(
      dashboardPaginationBlocks(
        queryResponse.response_metadata?.next_cursor,
      ),
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
      return { error: errorMsg };
    }
  }
};
