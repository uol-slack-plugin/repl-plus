import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Module } from "../types/module.ts";
import { Review } from "../types/review.ts";

// CONSTANTS
export const FILTER_USER_MODULES_FUNCTION_CALLBACK_ID =
  "filter_user_modules_function";

// DEFINITION
export const FilterUserModulesDefinition = DefineFunction({
  callback_id: FILTER_USER_MODULES_FUNCTION_CALLBACK_ID,
  title: "Filter user modules function",
  source_file: "functions/filter_user_modules.ts",
  input_parameters: {
    properties: {
      user_reviews: { type: Schema.types.array, items: { type: Review } },
      modules: { type: Schema.types.array, items: { type: Module } },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: [
      "modules",
      "user_reviews",
    ],
  },
  output_parameters: {
    properties: {
      modules_not_reviewed: { type: Schema.types.array, items: { type: Schema.types.string } },
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["modules_not_reviewed"],
  },
});

// IMPLEMENTATION
export default SlackFunction(
  FilterUserModulesDefinition,
  ({ inputs }) => {

    const modules_not_reviewed: string[] = []

    // Compare ids and get non matching objects
    const filteredModules = inputs.modules.filter((m) =>
      !inputs.user_reviews.some((r) => m.id === r.module_id)
    ).filter((m)=>m.name);

    filteredModules.forEach((m)=> modules_not_reviewed.push(m.name))


    return {
      outputs: {
        modules_not_reviewed,
        interactivity: inputs.interactivity,
      },
    };
  },
);
