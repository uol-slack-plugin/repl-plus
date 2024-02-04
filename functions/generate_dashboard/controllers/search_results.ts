import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import {
  END_DATE_ACTION_ID,
  END_DATE_ID,
  MODULE_ACTION_ID,
  MODULE_ID,
  RATING_ACTION_ID,
  RATING_ID,
  START_DATE_ACTION_ID,
  START_DATE_ID,
} from "../constants.ts";
import { Review } from "../../../types/classes/review.ts";
import { Body } from "../../../types/body.ts";
import { fetchReviews } from "../../../datastores/functions.ts";
import { handleChatError, handleResError } from "../../../utils/errors.ts";
import {  dateToUnix, getStarRatingFromStars } from "../../../utils/converters.ts";
import { generateSearchResultsBlocks } from "../../../blocks/search_results.ts";
import { Metadata } from "../../../types/metadata.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { getDateValue, getOptionValue } from "../../../utils/state.ts";
import { moduleIdExpression } from "../../../datastores/expressions.ts";
import { Module } from "../../../types/module.ts";
export default async function SearchResultsController(
  metadata: Metadata,
  body: Body,
  client: SlackAPIClient,
  updateMessage: UpdateMessage,
  modules: Module[],
) {

  console.log("Metadata", metadata);

  // validation
  const moduleId = metadata.search?.moduleId ?? getOptionValue(MODULE_ID, MODULE_ACTION_ID, body);
  if (moduleId === null) return { validation: false };

  // get other values from form
  const averageRating = metadata.search?.averageRating ?? getStarRatingFromStars(getOptionValue(RATING_ID, RATING_ACTION_ID, body)??'');
  const startDate = metadata.search?.startDate ?? dateToUnix( getDateValue(START_DATE_ID, START_DATE_ACTION_ID, body));
  const endDate = metadata.search?.endDate ?? dateToUnix(getDateValue(END_DATE_ID, END_DATE_ACTION_ID, body));

  // get reviews
  const res = await fetchReviews(client,moduleIdExpression(moduleId));
  if (!(res).ok) return handleResError(res,"SearchResultsController::Error at fetchReviews()");
  const reviews = Review.constructReviews(res.items);

  const sortedAndFilteredReviews = Review.filterAndSortReviews(
    reviews,
    averageRating,
    startDate,
    endDate);

  // Update metadata to return to search results if read mode
  metadata.search = {
    moduleId: moduleId !== undefined ? moduleId : null,
    averageRating: averageRating !== undefined ? averageRating : null,
    startDate: startDate !== undefined ? startDate : null,
    endDate: endDate !== undefined ? endDate : null,
  };

  // generate blocks
  const blocks = generateSearchResultsBlocks(
    metadata,
    modules,
    sortedAndFilteredReviews);

  // update message block
  const msgUpdate = await client.chat.update({
    channel: updateMessage.channelId,
    ts: updateMessage.messageTs,
    blocks,
  });
  if (!msgUpdate.ok) return handleChatError(msgUpdate);
}
