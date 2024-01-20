import { Schema } from "deno-slack-sdk/mod.ts";
import { difficultyRating, rating, timeRating } from "../types/rating.ts";
import {
  convertIntToDifficultyRating,
  convertIntToRating,
  convertIntToTimeRating,
} from "../utils/converters.ts";
import { InteractiveStep } from "../types/interactiveStep.ts";

export const createReview: InteractiveStep = (getModulesStep) => ({
  elements: [{
    name: "module_name",
    title: "Which module are you reviewing?",
    description:
      "Computer Science modules offer by Goldsmith's University of London",
    type: Schema.types.string,
    enum: getModulesStep.outputs.module_names,
    default: getModulesStep.outputs.module_name,
  }, {
    name: "rating_quality",
    title: "How would you rate this course in terms of quality?",
    type: Schema.types.string,
    enum: rating,
    default: convertIntToRating(getModulesStep.outputs.rating_quality),
  }, {
    name: "rating_difficulty",
    title: "How would you rate this course in terms of difficulty?",
    type: Schema.types.string,
    enum: difficultyRating,
    default: convertIntToDifficultyRating(
      getModulesStep.outputs.rating_difficulty,
    ),
  }, {
    name: "rating_learning",
    title: "How would you rate this course in terms of learning?",
    type: Schema.types.string,
    enum: rating,
    default: convertIntToRating(getModulesStep.outputs.rating_learning),
  }, {
    name: "time_consumption",
    title: "How much time did you spend on this module?",
    type: Schema.types.string,
    enum: timeRating,
    default: convertIntToTimeRating(getModulesStep.outputs.time_consumption),
  }, {
    name: "review",
    title: "Write a review",
    description: "What are your thoughts on this course?",
    type: Schema.types.string,
    long: true,
    default: getModulesStep.outputs.review,
  }],
  required: [
    "module_name",
    "time_consumption",
    "rating_learning",
    "review",
    "rating_quality",
    "rating_difficulty",
  ],
});
