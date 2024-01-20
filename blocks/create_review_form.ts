import { Env } from "deno-slack-sdk/types.ts";
import { Schema } from "deno-slack-sdk/mod.ts";
import { TypedWorkflowStepDefinition } from "deno-slack-sdk/workflows/workflow-step.ts";
import { ParameterDefinition } from "deno-slack-sdk/parameters/definition_types.ts";
import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "deno-slack-sdk/parameters/types.ts";
import { difficultyRating, rating, timeRating } from "../types/rating.ts";

type InteractiveStep = <
  T extends ParameterSetDefinition,
  S extends ParameterSetDefinition,
  U extends PossibleParameterKeys<T>,
  V extends PossibleParameterKeys<S>,
>(getModulesStep: TypedWorkflowStepDefinition<T, S, U, V>) => any;
// TODO: Create type for blocks

//
export const createReview: InteractiveStep = (getModulesStep) => ({
  elements: [{
    name: "module_name",
    title: "Which module are you reviewing?",
    description:
      "Computer Science modules offer by Goldsmith's University of London",
    type: Schema.types.string,
    enum: getModulesStep.outputs.module_names,
  }, {
    name: "rating_quality",
    title: "How would you rate this course in terms of quality?",
    type: Schema.types.string,
    enum: rating,
  }, {
    name: "rating_difficulty",
    title: "How would you rate this course in terms of difficulty?",
    type: Schema.types.string,
    enum: difficultyRating,
  }, {
    name: "rating_learning",
    title: "How would you rate this course in terms of learning?",
    type: Schema.types.string,
    enum: rating,
  }, {
    name: "time_consumption",
    title: "How much time did you spend on this module?",
    type: Schema.types.string,
    enum: timeRating,
  }, {
    name: "review",
    title: "Write a review",
    description: "What are your thoughts on this course?",
    type: Schema.types.string,
    long: true,
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
