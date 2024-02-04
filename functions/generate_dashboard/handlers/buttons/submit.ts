import { BlockActionHandler } from "deno-slack-sdk/functions/types.ts";
import { GenerateDashboardDefinition } from "../../definition.ts";
import { Metadata } from "../../../../types/metadata.ts";
import { UpdateMessage } from "../../../../types/update_message.ts";
import EditFormController from "../../controllers/edit_review_form.ts";
import { getOptionValue } from "../../../../utils/state.ts";
import DashboardController from "../../controllers/dashboard.ts";
import { separateString } from "../../../../utils/regular_expressions.ts";
import UpdateReviewController from "../../controllers/update.ts";
import {
  CREATE_REVIEW,
  DASHBOARD,
  EDIT,
  EDIT_REVIEWS,
  SEARCH_RESULTS,
  SEARCH_REVIEWS,
  SELECT_REVIEW_ACTION_ID,
  SELECT_REVIEW_ID,
} from "../../constants.ts";
import CreateReviewFormController from "../../controllers/create_review_form.ts";
import CreateReviewController from "../../controllers/create_review.ts";
import SearchResultsController from "../../controllers/search_results.ts";
import SearchFormController from "../../controllers/search_form.ts";
import {
  hasErrorProperty,
  hasValidationProperty,
  isMetadata,
} from "../../../../utils/type_guards.ts";
import { Module } from "../../../../types/module.ts";
import { Alert } from "../../../../types/alert.ts";

export const SubmitButton: BlockActionHandler<
  typeof GenerateDashboardDefinition.definition
> = async ({ client, body, action }) => {
  if (!client) {
    throw new Error("Client is missing");
  }

  if (
    !body || !body.function_data || !body.function_data.inputs ||
    !body.function_data.inputs.modules || !body.user || !body.user.id
  ) {
    throw new Error("Invalid body parameters");
  }

  const modules: Module[] = body.function_data.inputs.modules;
  const userId: string = body.user.id;
  const reviewIdFromEditMenu: string | null = getOptionValue(
    SELECT_REVIEW_ID,
    SELECT_REVIEW_ACTION_ID,
    body,
  );

  
  // Check if there is an id in action.value
  let metadata: unknown;
  let reviewId: string | null = null;
  
  if (!action || !action.value) {
    throw new Error("Action value is missing");
  }

  const result = separateString(action.value);
  
  if (result === null) {
    metadata = JSON.parse(action.value) as Metadata;
  } else {
    if (
      typeof result.object !== "object" || typeof result.stringPart !== "string"
      ) {
        throw new Error("Invalid action value format");
      }
      metadata = result.object;
      reviewId = result.stringPart;
    }
    
  if (!isMetadata(metadata)) {
    throw new Error("Invalid metadata");
  }
  
  const updateMessage: UpdateMessage = {
    channelId: body.container.channel_id,
    messageTs: body.container.message_ts,
  };
  const lastPage = metadata.pages[metadata.pages.length - 1];
  
  console.log("reviewIdFromEditMenu",lastPage === EDIT_REVIEWS)
  console.log("SubmitButton::", metadata);
  try {
    if (lastPage === EDIT_REVIEWS && reviewIdFromEditMenu !== null) {
      metadata.pages.push(EDIT);
      console.log("SubmitButton::Next::", metadata);
      await EditFormController(
        metadata,
        client,
        updateMessage,
        modules,
        userId,
        reviewIdFromEditMenu,
      );
    }

    if (lastPage === EDIT && reviewId !== null) {
      await UpdateReviewController(body, client, reviewId);
      metadata.pages = [DASHBOARD];
      metadata.search = undefined;
      metadata.cursors = [];
      console.log("SubmitButton::Next::", metadata);
      const successAlert: Alert = {
        success:
          "Congratulations! 🎉 You've successfully fine-tuned your review to perfection! 🚀 Your updated insights are now shining brightly, ready to illuminate the path for fellow learners. 🌟 Keep shaping the community with your thoughtful contributions! 💡📚",
      };
      await DashboardController(
        metadata,
        client,
        updateMessage,
        modules,
        successAlert,
      );
    }

    if (lastPage === CREATE_REVIEW) {
      console.log("SubmitButton::Next::", metadata);
      const validation = await CreateReviewController(body, client, userId);

      if (validation.error) {
        throw new Error(validation.error);
      }

      if (!validation.pass) {
        await CreateReviewFormController(
          metadata,
          client,
          updateMessage,
          modules,
          userId,
          validation.reviewEntry,
        );
      }

      if (validation.pass) {
        metadata.pages = [DASHBOARD];
        metadata.cursors = [];
        console.log("SubmitButton::Next::", metadata);
        const successAlert: Alert = {
          success:
            "You've just unlocked the power of your voice! 🚀 Your insightful review has been securely added to our database, ready to inspire and guide fellow learners on their journey. 🌟 Keep sharing your experiences and shaping the community with your valuable feedback! 📚💬",
        };
        await DashboardController(
          metadata,
          client,
          updateMessage,
          modules,
          successAlert,
        );
      }
    }

    if (lastPage === SEARCH_REVIEWS) {
      metadata.pages.push(SEARCH_RESULTS);
      console.log("SubmitButton::Next::", metadata);
      const _results = await SearchResultsController(
        metadata,
        body,
        client,
        updateMessage,
        modules,
      );

      if (hasValidationProperty(result)) {
        await SearchFormController(
          metadata,
          client,
          updateMessage,
          modules,
        );
      }

      if (hasErrorProperty(result)) {
        throw new Error("Wrong results");
      }
    }
  } catch (error) {
    console.error(error);
    const errorAlert: Alert = {
      error: error.message,
    };

    await DashboardController(
      metadata,
      client,
      updateMessage,
      modules,
      errorAlert,
    );
  }
};
