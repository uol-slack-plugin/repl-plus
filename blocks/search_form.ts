import {
  BACK,
  END_DATE_ACTION_ID,
  END_DATE_ID,
  MODULE_ACTION_ID,
  MODULE_ID,
  RATING_ACTION_ID,
  RATING_ID,
  START_DATE_ACTION_ID,
  START_DATE_ID,
  SUBMIT,
} from "../functions/generate_dashboard/constants.ts";
import {
  datePicker,
  divider,
  header,
  mrkdwnSection,
  selectType2,
  submitAndCancelButtons,
} from "./blocks.ts";
import { Metadata } from "../types/metadata.ts";
import { InteractiveBlock } from "../types/interactive_blocks.ts";
import { Module } from "../types/module.ts";
import { generateStarRating } from "../utils/converters.ts";

export function generateSearchFormBlocks(
  metadata: Metadata,
  modules: Module[],
): InteractiveBlock[] {
  const blocks = [];
  const metadataString = JSON.stringify(metadata);

  const ratings = [
    generateStarRating(1),
    generateStarRating(2),
    generateStarRating(3),
    generateStarRating(4),
    generateStarRating(5),
  ];

  blocks.push(header("Search reviews"));
  blocks.push(divider);
  blocks.push(
    selectType2(
      MODULE_ID,
      MODULE_ACTION_ID,
      "Select a module that you're interested (Required)",
      "Select a module",
      modules,
    ),
  );

  blocks.push(
    selectType2(
      RATING_ID,
      RATING_ACTION_ID,
      "Select the average rating that you're interested",
      "Select a rating",
      ratings,
    ),
  );

  blocks.push(mrkdwnSection("*Date range*"));
  blocks.push(divider);
  blocks.push(datePicker(
    START_DATE_ID,
    START_DATE_ACTION_ID,
    "Pick a start date.",
    "2024-01-01",
  ));

  blocks.push(datePicker(
    END_DATE_ID,
    END_DATE_ACTION_ID,
    "Pick an end date.",
    "2025-01-01",
  ));

  blocks.push(divider);
  blocks.push(
    submitAndCancelButtons(
      BACK,
      SUBMIT,
      metadataString,
    ),
  );

  return blocks;
}
