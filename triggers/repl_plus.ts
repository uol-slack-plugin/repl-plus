import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import ReplPlusWorkflow from "../workflows/repl_plus_workflow.ts";

const ReplPlusTrigger: Trigger<typeof ReplPlusWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "REPL Plus",
  description: "REPL Plus enables students to review their modules and share experiences, aiding in informed course selections. 📚 Through community-driven feedback and discussions, it enhances module planning by providing authentic insights from peers with direct course experience. 💬",
  workflow: `#/workflows/${ReplPlusWorkflow.definition.callback_id}`,
  inputs: {
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default ReplPlusTrigger;
