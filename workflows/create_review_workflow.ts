import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetUserReviewsDefinition } from "../functions/get_user_reviews.ts";
import { GetModulesDefinition } from "../functions/get_modules.ts";
import { FilterUserModulesDefinition } from "../functions/filter_user_modules.ts";
import { CreateReviewDefinition } from "../functions/create_review.ts";
import { FindModuleIdDefinition } from "../functions/find_module_id.ts";
import { createReview } from "../blocks/create_review_form.ts";

const CreateReviewWorkflow = DefineWorkflow({
  callback_id: "create-review-workflow",
  title: "Create a review Workflow",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      channel_id: { type: Schema.slack.types.channel_id },
      user_id: { type: Schema.slack.types.user_id },
    },
    required: ["interactivity", "channel_id", "user_id"],
  },
});

const getUserReviewsStep = CreateReviewWorkflow.addStep(
  GetUserReviewsDefinition,{
    user_id: CreateReviewWorkflow.inputs.user_id,
    interactivity: CreateReviewWorkflow.inputs.interactivity
  }
)

const getModulesStep = CreateReviewWorkflow.addStep(
  GetModulesDefinition,
  {
    interactivity: getUserReviewsStep.outputs.interactivity,
  },
);

const filterUserModulesStep = CreateReviewWorkflow.addStep(
  FilterUserModulesDefinition,
  {
    interactivity: getModulesStep.outputs.interactivity,
    modules: getModulesStep.outputs.modules,
    user_reviews: getUserReviewsStep.outputs.reviews
  }
)

const inputForm = CreateReviewWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create a review",
    interactivity: filterUserModulesStep.outputs.interactivity,
    submit_label: "Create",
    description: "Create a review for a module, be creative and honest!",
    fields: { ...createReview(filterUserModulesStep) },
  },
);

const findModuleIdStep = CreateReviewWorkflow.addStep(
  FindModuleIdDefinition,
  {
    modules: getModulesStep.outputs.modules,
    module_name: inputForm.outputs.fields.module_name,
  },
);

CreateReviewWorkflow.addStep(
  CreateReviewDefinition,
  {
    user_id: CreateReviewWorkflow.inputs.user_id,
    module_id: findModuleIdStep.outputs.module_id,
    review: inputForm.outputs.fields.review,
    rating_quality: inputForm.outputs.fields.rating_quality,
    rating_difficulty: inputForm.outputs.fields.rating_difficulty,
    rating_learning: inputForm.outputs.fields.rating_learning,
    time_consumption: inputForm.outputs.fields.time_consumption,
  },
);

CreateReviewWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: CreateReviewWorkflow.inputs.channel_id,
    message: `You have successfully entered an entry`,
  },
);

export default CreateReviewWorkflow;
