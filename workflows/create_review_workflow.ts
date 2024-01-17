import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetModules } from "../functions/get_modules_function.ts";

const CreateReviewWorkflow = DefineWorkflow({
  callback_id: "create-review-workflow",
  title: "Create a review Workflow",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      channel_id: { type: Schema.slack.types.channel_id },
      user_id: { type: Schema.slack.types.user_id },
    },
    required: ["interactivity","channel_id","user_id"],
  },
});

const getModulesStep = CreateReviewWorkflow.addStep(GetModules,{interactivity:CreateReviewWorkflow.inputs.interactivity});

const inputForm = CreateReviewWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create a review",
    interactivity: getModulesStep.outputs.interactivity,
    submit_label: "Create",
    description: "Create a review for a module, be creative and honest!",
    fields: {
      elements: [{
        name: "module_name",
        title: "Select module",
        description:
          "Computer Science modules offer by Goldsmith's University of London",
        type: Schema.types.string,
        enum: getModulesStep.outputs.module_names,
      }, {
        name: "review",
        title: "Write a review",
        description: "What are your thoughts on this course?",
        type: Schema.slack.types.rich_text,
      }, {
        name: "rating_quality",
        title: "Select Quality Score",
        description:
          "On a scale of one to five, with one being low and 5 being hight, how would you rate this course in terms of quality? ",
        type: Schema.types.number,
        enum: [1, 2, 3, 4, 5],
      }, {
        name: "rating_difficulty",
        title: "Select Difficulty Score",
        description:
          "On a scale of one to five, with one being low and 5 being hight, how would you rate this course in terms of difficulty? ",
        type: Schema.types.number,
        enum: [1, 2, 3, 4, 5],
      }, {
        name: "rating_learning",
        title: "Select Learning Score",
        description:
          "On a scale of one to five, with one being low and 5 being hight, how would you rate this course in terms of learning? ",
        type: Schema.types.number,
        enum: [1, 2, 3, 4, 5],
      }, {
        name: "time_consumption",
        title: "Select Time Consumption Score",
        description: "How much time did you spend on this module? ",
        type: Schema.types.number,
        enum: [1, 2, 3, 4, 5],
      }],
      required: [
        "module_name",
        "review",
      ],
    },
  },
);

CreateReviewWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: CreateReviewWorkflow.inputs.channel_id,
  message: 
  `module_name: ${inputForm.outputs.fields.module_name}\n
  review: ${inputForm.outputs.fields.review}\n
  r_quality: ${inputForm.outputs.fields.rating_quality}\n
  r_difficulty: ${inputForm.outputs.fields.rating_difficulty}\n
  r_learning: ${inputForm.outputs.fields.rating_learning}\n
  r_time_consumption: ${inputForm.outputs.fields.time_consumption}\n`,
})

export default CreateReviewWorkflow;
