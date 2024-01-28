import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { editReviewFormBlocks } from "../../../blocks/edit_review_blocks.ts";

import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import {
  SELECT_REVIEW_A_ID,
  SELECT_REVIEW_B_ID,
  START_EDIT_REVIEW_FROM_REVIEW,
} from "../constants.ts";

import {
  convertIntToDifficultyRating,
  convertIntToRating,
  convertIntToTimeRating,
} from "../../../utils/converters.ts";

import { InteractiveBlock } from "../../../types/InteractiveBlock.ts";
import { getOptionValue, handleError } from "../../function_utils.ts";

export const EditReviewForm: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body }) => {
  const reviewId =
    body.actions.filter((b) => b.action_id === START_EDIT_REVIEW_FROM_REVIEW)[0]
      .value ??
      getOptionValue(SELECT_REVIEW_B_ID, SELECT_REVIEW_A_ID, body);

  // get review to edit
  const getResponse = await client.apps.datastore.get<
    typeof ReviewsDatastore.definition
  >({
    datastore: ReviewsDatastore.name,
    id: reviewId,
  });

  if (!getResponse.ok) {
    return handleError(getResponse);
  }

  const originalReview = getResponse.item;

  const blocks: InteractiveBlock[] = editReviewFormBlocks(
    convertIntToRating(originalReview.rating_quality),
    convertIntToDifficultyRating(
      originalReview.rating_difficulty,
    ),
    convertIntToTimeRating(originalReview.time_consumption),
    convertIntToRating(originalReview.rating_learning),
    "",
    originalReview.review,
  );

  // update message block
  const msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks,
    metadata: {
      event_type: "data",
      event_payload: {
        ...originalReview,
      },
    },
  });

  // handle error
  if (!msgUpdate.ok) {
    return handleError(msgUpdate);
  }
};
