import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";

import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";

import { generateDashboardBlocks } from "../../../blocks/blockUtils.ts";
import { getOptionValue, getValue, handleError } from "../../function_utils.ts";
import {
  EDIT_CONTENT_A_ID,
  EDIT_CONTENT_B_ID,
  EDIT_DIFFICULTY_RATING_A_ID,
  EDIT_DIFFICULTY_RATING_B_ID,
  EDIT_LEARNING_RATING_A_ID,
  EDIT_LEARNING_RATING_B_ID,
  EDIT_QUALITY_RATING_A_ID,
  EDIT_QUALITY_RATING_B_ID,
  EDIT_TIME_RATING_A_ID,
  EDIT_TIME_RATING_B_ID,
  LIMIT_QUERY_REVIEWS,
} from "../constants.ts";
import { editReviewFormBlocks } from "../../../blocks/edit_review_blocks.ts";
import {
  convertDifficultyRatingToInt,
  convertRatingToInt,
  convertTimeRatingToInt,
} from "../../../utils/converters.ts";
import { Review } from "../../../types/review.ts";

export const EditReview: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body }) => {
  console.log(body.message?.metadata);

  // Get form inputs
  const {
    id,
    time_consumption,
    review: originalReview,
    rating_learning,
    rating_difficulty,
    rating_quality,
  } = body.message
    ?.metadata?.event_payload as Review; // TODO: Add actual type

  let msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks: editReviewFormBlocks(),
  });

  if (!msgUpdate.ok) {
    return handleError(msgUpdate);
  }

  const review = getValue(EDIT_CONTENT_B_ID, EDIT_CONTENT_A_ID, body);
  const time = getOptionValue(
    EDIT_TIME_RATING_B_ID,
    EDIT_TIME_RATING_A_ID,
    body,
  );

  const quality = getOptionValue(
    EDIT_QUALITY_RATING_B_ID,
    EDIT_QUALITY_RATING_A_ID,
    body,
  );
  const learning = getOptionValue(
    EDIT_LEARNING_RATING_B_ID,
    EDIT_LEARNING_RATING_A_ID,
    body,
  );
  const difficulty = getOptionValue(
    EDIT_DIFFICULTY_RATING_B_ID,
    EDIT_DIFFICULTY_RATING_A_ID,
    body,
  );

  console.log(review, time);

  if (!id) {
    const error = { error: "Missing parameter: id" };
    console.log(error);
    return error;
  }

  // Call the API
  const res = await client.apps.datastore.update<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
    item: {
      id: id,
      review: review ?? originalReview,
      time_consumption: time ? convertTimeRatingToInt(time) : time_consumption,
      rating_quality: quality ? convertRatingToInt(quality) : rating_quality,

      rating_difficulty: difficulty
        ? convertDifficultyRatingToInt(difficulty)
        : rating_difficulty,

      rating_learning: learning
        ? convertRatingToInt(learning)
        : rating_learning,
      updated_at: Date.now(),
    },
  });

  // handle API error
  if (!res.ok) {
    return handleError(res);
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
    return handleError(queryResponse);
  }

  const blocks = generateDashboardBlocks(queryResponse);

  // update message block
  msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks,
  });

  // handle error
  if (!msgUpdate.ok) {
    return handleError(msgUpdate);
  }
};
