import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const REVIEW_TYPE_NAME = "review_type";

export const Review = DefineType({
  name: REVIEW_TYPE_NAME,
  type: Schema.types.object,
  properties: {
    id: { type: Schema.types.string },
    user_id: { type: Schema.slack.types.user_id },
    module_id: { type: Schema.types.string },
    review: { type: Schema.types.string },
    time_consumption: { type: Schema.types.integer },
    rating_quality: { type: Schema.types.integer },
    rating_difficulty: { type: Schema.types.integer },
    rating_learning: { type: Schema.types.integer },
    helpful_votes: { type: Schema.types.integer },
    unhelpful_votes: { type: Schema.types.integer },
    created_at: { type: Schema.types.number },
    updated_at: { type: Schema.types.number },
  },
  required: [
    "id",
    "user_id",
    "module_id",
    "review",
    "time_consumption",
    "rating_quality",
    "rating_difficulty",
    "rating_learning",
    "created_at",
    "updated_at",
  ],
});

export interface Review {
  id: string;
  user_id: string;
  module_id: string;
  review: string;
  time_consumption: number;
  rating_quality: number;
  rating_difficulty: number;
  rating_learning: number;
  created_at: number;
  updated_at: number;
}
