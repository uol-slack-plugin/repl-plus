import { BACK, EDIT } from "../functions/generate_dashboard/constants.ts";
import { Review } from "../types/review.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Metadata } from "../types/metadata.ts";
import { Module } from "../types/module.ts";
import { findModuleNameById } from "../utils/modules.ts";
import { averageRating } from "../utils/average_calc.ts";
import {
  divider,
  header,
  readActionButtons,
  readGeneralInfo,
  readRatingBreakDown,
  readTitleAndReview,
} from "./blocks.ts";

export const generateReadBlocks = (
  metadata: Metadata,
  modules: Module[],
  review: Review,
  currentUserId: string,
): InteractiveBlock[] => {
  const blocks = [];
  const metadataString = JSON.stringify(metadata)

  blocks.push(header(
    findModuleNameById(modules, review.module_id),
  ));
  blocks.push(readGeneralInfo(
    review.user_id,
    averageRating(
      review.rating_difficulty,
      review.rating_learning,
      review.rating_quality,
      review.time_consumption,
    ),
    review.created_at,
  ));
  blocks.push(divider);
  blocks.push(readRatingBreakDown(
    review.rating_quality,
    review.rating_difficulty,
    review.time_consumption,
    review.rating_learning,
  ));
  blocks.push(divider);
  blocks.push(readTitleAndReview(review.title, review.content));
  blocks.push(readActionButtons(
    review.id,
    review.user_id,
    currentUserId,
    BACK,
    EDIT,
    "DELETE_REVIEW",
    metadataString,
  ));

  return blocks;
};
