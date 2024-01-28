import { Schema } from "deno-slack-sdk/mod.ts";
import { difficultyRating, rating, timeRating } from "../types/rating.ts";
import {
  convertIntToDifficultyRating,
  convertIntToRating,
  convertIntToTimeRating,
} from "../utils/converters.ts";
import { InteractiveStep } from "../types/interactiveStep.ts";

export const createReview: InteractiveStep = (getModulesStep) => ({
  elements: [
    {
      name: "module_names",
      title: "Which modules are you looking for?",
      type: Schema.types.array,
      items: getModulesStep.outputs.module_names as string[],
    },
    {
      name: "average_rating",
      title: "Search by average rating",
      type: Schema.types.number,
      min: 1,
      max: 5,
    },
    {
      name: "start_date",
      title: "Date range start",
      type: Schema.slack.types.timestamp,
    },
    {
      name: "end_date",
      title: "Date range end",
      type: Schema.slack.types.timestamp,
    },
  ],
  required: [
    "module_names",
    "average_rating",
    "start_date",
    "end_date",
  ],
});
