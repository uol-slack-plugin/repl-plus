import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const REVIEW_TYPE_NAME = "review_type";

export const Review = DefineType({
  name: REVIEW_TYPE_NAME,
  type: Schema.types.object,
  properties: {
    id: { type: Schema.types.string },
    review: { type: Schema.types.string },
    time_consumption: { type: Schema.types.integer },
    rating_quality: { type: Schema.types.integer },
    rating_difficulty: { type: Schema.types.integer },
    rating_learning: { type: Schema.types.integer },
  },
  required: [
    "id",
    "review",
    "time_consumption",
    "rating_quality",
    "rating_difficulty",
    "rating_learning",
  ],
});
