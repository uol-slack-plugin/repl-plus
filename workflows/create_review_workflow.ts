import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const CreateReviewWorkflow = DefineWorkflow({
  callback_id: "create-review-workflow",
  title: "Create a review Workflow",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

const inputForm = CreateReviewWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send a greeting",
    interactivity: CreateReviewWorkflow.inputs.interactivity,
    submit_label: "Send greeting",
    fields: {
      elements: [{
        name: "channel",
        title: "Channel to send message to",
        type: Schema.slack.types.channel_id,
        default: CreateReviewWorkflow.inputs.channel,
      }, {
        name: "message",
        title: "Message to recipient",
        type: Schema.types.string,
        long: true,
      }],
      required: ["recipient", "channel", "message"],
    },
  },
);

CreateReviewWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputForm.outputs.fields.channel,
  message: inputForm.outputs.fields.message,
});

export default CreateReviewWorkflow;
