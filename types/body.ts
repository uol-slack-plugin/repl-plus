import { BlockActionInvocationBody } from "deno-slack-sdk/functions/interactivity/types.ts";
import { FunctionRuntimeParameters } from "deno-slack-sdk/functions/types.ts";

export type Body = BlockActionInvocationBody<
  FunctionRuntimeParameters<{
    user_id: {
      type: "slack#/types/user_id";
    };
  }, "user_id"[]>
>;