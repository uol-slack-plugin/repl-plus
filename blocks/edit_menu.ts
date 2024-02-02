import {
  BACK,
  READ,
  SELECT_REVIEW_ACTION_ID,
  SELECT_REVIEW_ID,
  SUBMIT,
} from "../functions/generate_dashboard/constants.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Metadata } from "../types/metadata.ts";
import { Module } from "../types/module.ts";
import { Review } from "../types/classes/review.ts";
import {
  createReviews,
  divider,
  header,
  selectType2,
  submitAndCancelButtons,
} from "./blocks.ts";

export function generateEditMenuBlocks(
  metadata: Metadata,
  reviews: Review[],
  modules: Module[],
): InteractiveBlock[] {
  const blocks = [];
  const metadataString = JSON.stringify(metadata);

  blocks.push(header("Edit Menu"));
  blocks.push(selectType2(
    SELECT_REVIEW_ID,
    SELECT_REVIEW_ACTION_ID,
    "Select a module that you'd like to edit",
    "Select a module",
    reviews,
    undefined,
    modules,
  ));
  blocks.push(submitAndCancelButtons(
    BACK,
    SUBMIT,
    metadataString,
  ));
  blocks.push(divider);
  blocks.push(...createReviews(
    READ,
    modules,
    reviews,
    metadataString,
  ));
  blocks.push(divider);
  return blocks;
}
