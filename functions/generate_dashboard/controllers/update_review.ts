import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import ReviewsDatastore from "../../../datastores/reviews_datastore.ts";
import { ReviewEntry, EntryType } from "../../../types/review_entry.ts";
import { convertTimeRatingToInt, convertRatingToInt, convertDifficultyRatingToInt } from "../../../utils/converters.ts";
import { MODULE_ID, MODULE_ACTION_ID, QUALITY_RATING_ID, QUALITY_RATING_ACTION_ID, DIFFICULTY_RATING_ID, DIFFICULTY_RATING_ACTION_ID, TIME_RATING_ID, TIME_RATING_ACTION_ID, LEARNING_RATING_ID, LEARNING_RATING_ACTION_ID, TITLE_ID, TITLE_ACTION_ID, CONTENT_ID, CONTENT_ACTION_ID } from "../constants.ts";
import { Validation } from "../../../types/validation.ts";
import { Metadata } from "../../../types/metadata.ts";
import { Review } from "../../../types/review.ts";

// deno-lint-ignore no-explicit-any
export default async function UpdateReviewController(metadata: Metadata, body:any, client:SlackAPIClient): Promise<Validation>{

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
    metadata.payload.review as Review,
  );
  const validation = ReviewEntry.validateReviewEntry(reviewEntry);

  if (!validation.pass) return validation;
  
  else { // update entry && render dashboard

    console.log("Update review")
    
    const putResponse = await client.apps.datastore.update<
      typeof ReviewsDatastore.definition
    >({
      datastore: ReviewsDatastore.name,
      item: {
        id: metadata.payload.review.id,
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
        console.log(queryErrorMsg);
        validation.error = queryErrorMsg;
      return validation;
    }

    return validation;

  }
};