import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";

import {
  CONTENT_ACTION_ID,
  CONTENT_ID,
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

import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import {
  convertDifficultyRatingToInt,
  convertRatingToInt,
  convertTimeRatingToInt,
} from "../../../utils/converters.ts";
import { EntryType, ReviewEntry } from "../../../types/review_entry.ts";

import { queryReviewDatastore } from "../../../datastores/functions.ts";
import { Review } from "../../../types/review.ts";
import { generateDashboardBlocks } from "../../../blocks/dashboard.ts";
import { generateReviewEntryFormBlocks } from "../../../blocks/review_form.ts";

export const CreateReviewSubmit: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ body, client, action }) => {
  const blocks = [];
  const reviewEntry = ReviewEntry.constructReviewEntryFromStatus(
    body,
    MODULE_ID,
    MODULE_ACTION_ID,
    QUALITY_RATING_ID,
    QUALITY_RATING_ACTION_ID,
    DIFFICULTY_RATING_ID,
    DIFFICULTY_RATING_ACTION_ID,
    TIME_RATING_ID,
    TIME_RATING_ACTION_ID,
    LEARNING_RATING_ID,
    LEARNING_RATING_ACTION_ID,
    TITLE_ID,
    TITLE_ACTION_ID,
    CONTENT_ID,
    CONTENT_ACTION_ID,
    EntryType.Create,
  );
  const validation = ReviewEntry.validateReviewEntry(reviewEntry);

  if (!validation.pass) { // render create review form
    blocks.push(
      ...generateReviewEntryFormBlocks(
        "Create a review",
        Module.constructModulesFromJson(action.value),
        validation.reviewEntry,
      ),
    );
  } else { // store entry && render dashboard
    const putResponse = await client.apps.datastore.put<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      item: {
        id: crypto.randomUUID(),
        module_id: validation.reviewEntry.module_id,
        user_id: body.user.id,
        title: validation.reviewEntry.title,
        content: validation.reviewEntry.content,
        time_consumption: convertTimeRatingToInt(
          validation.reviewEntry.time_consumption,
        ),
        rating_quality: convertRatingToInt(
          validation.reviewEntry.rating_quality,
        ),
        rating_difficulty: convertDifficultyRatingToInt(
          validation.reviewEntry.rating_difficulty,
        ),
        rating_learning: convertRatingToInt(
          validation.reviewEntry.rating_learning,
        ),
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    });

    // handle API error
    if (!putResponse.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${putResponse.error})`;
      return { error: queryErrorMsg };
    }

    // get reviews
    const reviewsResponse = await queryReviewDatastore(client);

    // handle error
    if (!reviewsResponse.ok) {
      const queryErrorMsg =
        `Error accessing reviews datastore (Error detail: ${reviewsResponse.error})`;
      return { error: queryErrorMsg };
    }

    // generate blocks
    blocks.push(...generateDashboardBlocks(
      Review.constructReviewsFromDatastore(reviewsResponse.items),
      reviewsResponse.response_metadata?.next_cursor,
    ));
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
};
