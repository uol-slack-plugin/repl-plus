import {
  BACK,
  DELETE,
  DISLIKE,
  EDIT,
  EDIT_VOTE,
  LIKE,
} from "../functions/generate_dashboard/constants.ts";
import { Review } from "../types/classes/review.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Metadata } from "../types/metadata.ts";
import { Module } from "../types/module.ts";
import { findModuleNameById } from "../utils/modules.ts";
import { averageRating } from "../utils/average_calc.ts";
import {
  confirm,
  divider,
  editVote,
  errorAlert,
  header,
  readActionButtons,
  readGeneralInfo,
  readRatingBreakDown,
  readTitleAndReview,
  sectionMrkdwn,
  voteForm,
} from "./blocks.ts";

export const generateReadBlocks = (
  metadata: Metadata,
  modules: Module[],
  review: Review,
  currentUserId: string,
  showVoteForm: boolean,
  error?: string,
): InteractiveBlock[] => {
  if (!metadata || !modules || !review || !currentUserId) {
    throw new Error(
      "Incomplete parameters provided to generateReadBlocks function",
    );
  }

  const blocks: InteractiveBlock[] = [];
  const metadataString = JSON.stringify(metadata);

  blocks.push(header(findModuleNameById(modules, review.module_id)));
  blocks.push(readGeneralInfo(
    review.user_id,
    averageRating(
      review.rating_difficulty,
      review.rating_learning,
      review.rating_quality,
    ),
    review.created_at,
  ));
  blocks.push(divider);
  blocks.push(sectionMrkdwn("\n*Rating breakdown*\n"));
  blocks.push(divider);
  blocks.push(readRatingBreakDown(
    review.rating_quality,
    review.rating_difficulty,
    review.time_consumption,
    review.rating_learning,
  ));
  blocks.push(divider);
  blocks.push(readTitleAndReview(review.title, review.content));
  blocks.push(divider);

  if (showVoteForm) {
    blocks.push(sectionMrkdwn("Did you find this review useful?"));
    blocks.push(voteForm(LIKE, DISLIKE, `${metadataString}\\${review.id}`));
  } else { // edit vote
    blocks.push(editVote(
      "You have voted for this review, would you like to edit your vote?",
      EDIT_VOTE,
      `${metadataString}\\${review.id}`,
    ));
  }
  error && blocks.push(errorAlert(error));
  blocks.push(divider);
  blocks.push(readActionButtons(
    review.id,
    review.user_id,
    currentUserId,
    BACK,
    EDIT,
    DELETE,
    metadataString,
    confirm(
      "Are you sure?",
      "Hey influential soul! Your words have the power to shape destinies and brighten lives. Don't delete your review - let it be the guiding light that leads fellow students to academic enlightenment! 🌟✨",
      "Do it",
      "Stop, I've changed my mind!",
    ),
  ));

  return blocks;
};
