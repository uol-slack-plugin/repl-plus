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

import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import {
  convertDifficultyRatingToInt,
  convertRatingToInt,
  convertTimeRatingToInt,
} from "../../../utils/converters.ts";
import { EntryType, ReviewEntry } from "../../../types/review_entry.ts";
import {
  generateDashboardBlocks,
  generateReviewEntryFormBlocks,
} from "../../../blocks/main.ts";
import { queryReviewDatastore } from "../../../datastores/functions.ts";
import { Review } from "../../../types/review.ts";

export const EditReviewSubmit: BlockActionHandler<
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
    EntryType.Edit,
  );
  const validation = ReviewEntry.validateReviewEntry(reviewEntry);

  if (!validation.pass) { // render create review form
    // get review
    const getResponse = await client.apps.datastore.get<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      id: action.value,
    });

    // handle error
    if (!getResponse.ok) {
      const queryErrorMsg =
        `Error getting review (Error detail: ${getResponse.error})`;
      return { error: queryErrorMsg };
    }

    // create blocks
    blocks.push(...generateReviewEntryFormBlocks(
      "Edit a review",
      undefined,
      validation.reviewEntry,
      new Review( // TO DO, pass review through value
        getResponse.item.id,
        getResponse.item.user_id,
        getResponse.item.module_id,
        getResponse.item.title,
        getResponse.item.content,
        getResponse.item.time_consumption,
        getResponse.item.rating_quality,
        getResponse.item.rating_difficulty,
        getResponse.item.rating_learning,
        getResponse.item.helpful_votes,
        getResponse.item.unhelpful_votes,
        getResponse.item.created_at,
        getResponse.item.updated_at,
      ),
    ));

  } else { // update entry && render dashboard
    const putResponse = await client.apps.datastore.update<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      item: {
        id: action.value,
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
