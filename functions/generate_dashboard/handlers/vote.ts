import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../definition.ts";
import { UpdateMessage } from "../../../types/update_message.ts";
import { separateString } from "../../../utils/regular_expressions.ts";
import { isMetadata } from "../../../utils/type_guards.ts";
import { DISLIKE, EDIT_VOTE, LIKE } from "../constants.ts";
import { Module } from "../../../types/module.ts";
import EditVoteController from "../controllers/edit_vote.ts";
import VoteController from "../controllers/vote.ts";
import ReadReviewController from "../controllers/read_review.ts";

export const VoteHandler: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  // Ensure required properties exist
  if (
    !body || !body.user || !body.user.id || !action || !action.action_id ||
    !body.container || !body.container.channel_id ||
    !body.container.message_ts || !body.function_data.inputs.modules
  ) {
    throw new Error("Incomplete request body");
  }

  const userId: string = body.user.id;
  const actionId: string = action.action_id;
  const modules: Module[] = body.function_data.inputs.modules;
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };

  // Validate action value
  if (!action.value) {
    throw new Error("Action value is missing");
  }

  // Extract metadata and reviewId
  const result = separateString(action.value);
  if (!result || !result.object || !result.stringPart) {
    throw new Error("Invalid action value format");
  }

  const { object: metadata, stringPart: reviewId } = result;

  // Validate metadata and reviewId
  if (!isMetadata(metadata) || typeof reviewId !== "string") {
    throw new Error("Invalid metadata or reviewId");
  }

  console.log("VoteHandler::", metadata);

  try {
    if (actionId === EDIT_VOTE) {
      // Call EditVoteController with validated parameters
      await EditVoteController(
        metadata,
        client,
        updateMessage,
        modules,
        reviewId,
        userId,
      );
    }

    if (actionId === LIKE) {
      // Call VoteController with validated parameters
      await VoteController(
        metadata,
        client,
        updateMessage,
        modules,
        reviewId,
        userId,
        LIKE,
      );
    }

    if (actionId === DISLIKE) {
      // Call VoteController with validated parameters
      await VoteController(
        metadata,
        client,
        updateMessage,
        modules,
        reviewId,
        userId,
        DISLIKE,
      );
    }
  } catch (error) {
    const errorMsg: string = error.message;
    console.error(error);
    ReadReviewController(
      metadata,
      client,
      updateMessage,
      modules,
      userId,
      reviewId,
      errorMsg,
    );
  }
};
