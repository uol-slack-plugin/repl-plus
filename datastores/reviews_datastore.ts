import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const ReviewsDatastore = DefineDatastore({
  name: "Reviews",
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
    title: {
      type: Schema.types.string,
    },
    content: {
      type: Schema.types.string,
    },
    helpful_votes: {
      type: Schema.types.integer,
    },
    unhelpful: {
      type: Schema.types.integer,
    },
    num_hours: {
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
      type: Schema.slack.types.date,
    },
    updated_at: {
      type: Schema.slack.types.date,
    },
  },
});

export default ReviewsDatastore;
