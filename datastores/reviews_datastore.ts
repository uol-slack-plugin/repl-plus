import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const REVIEWS_DATASTORE_NAME = "reviews_datastore"

const ReviewsDatastore = DefineDatastore({
  name: REVIEWS_DATASTORE_NAME,
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    module_id: {
      type: Schema.types.string,
    },
    user_id: {
      type: Schema.slack.types.user_id,
    },
    review: {
      type: Schema.types.string,
    },
    helpful_votes: {
      type: Schema.types.integer,
    },
    unhelpful_votes: {
      type: Schema.types.integer,
    },
    time_consumption: {
      type: Schema.types.integer,
    },
    rating_quality: {
      type: Schema.types.integer,
    },
    rating_difficulty: {
      type: Schema.types.integer,
    },
    rating_learning: {
      type: Schema.types.integer,
    },
    created_at: {
      type: Schema.types.number,
    },
    updated_at: {
      type: Schema.types.number,
    },
  },
});

export default ReviewsDatastore;
