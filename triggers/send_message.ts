import { Trigger } from "deno-slack-api/types.ts";
import { SendMessageWorkflow } from "../workflows/send_message_workflow.ts";

const trigger: Trigger = {
  type: "shortcut",
  name: "Send a message",
  description: "Send a message on behalf of the REPL Plus team.",
  workflow: `#/workflows/${SendMessageWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
  },
};

export default trigger;