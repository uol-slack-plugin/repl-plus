// workflows/give_kudos.ts
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const SEND_MESSAGE_WORKFLOW_CALLBACK_ID = "send_message_workflow_callback_id";

const SendMessageWorkflow = DefineWorkflow({
  callback_id: SEND_MESSAGE_WORKFLOW_CALLBACK_ID,
  title: "Send a Message",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

/* Collect message information */
const message = SendMessageWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send a message",
    interactivity: SendMessageWorkflow.inputs.interactivity,
    submit_label: "Share",
    fields: {
      elements: [{
        name: "channel",
        title: "Where should this message be shared?",
        type: Schema.slack.types.channel_id,
      }, {
        name: "message",
        title: "What would you like to say?",
        type: Schema.types.string,
        long: true,
      }],
      required: ["channel", "message"],
    },
  },
);

/* Share message */
SendMessageWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: message.outputs.fields.channel,
  message: message.outputs.fields.message,
});

export { SendMessageWorkflow };
