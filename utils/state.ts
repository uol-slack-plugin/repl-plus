import { BaseResponse } from "deno-slack-api/types.ts";
import { DatastoreQueryResponse } from "deno-slack-api/typed-method-types/apps.ts";
import { BlockActionInvocationBody } from "deno-slack-sdk/functions/interactivity/types.ts";
import { FunctionRuntimeParameters } from "deno-slack-sdk/functions/types.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";

type Body = BlockActionInvocationBody<
  FunctionRuntimeParameters<{
    user_id: {
      type: "slack#/types/user_id";
    };
  }, "user_id"[]>
>;

export const getOptionValue = (
  blockId: string,
  actionId: string,
  body: Body,
) => {
  return body.state.values?.[blockId]?.[actionId]?.selected_option?.value;
};

export const getValue = (
  blockId: string,
  actionId: string,
  body: Body,
) => {
  return body.state.values?.[blockId]?.[actionId]?.value;
};

export const handleError = (
  msgUpdate:
    | BaseResponse
    | DatastoreQueryResponse<typeof ReviewsDatastore.definition>,
) => {
  const errorMsg = `Error during chat.update!", ${
    msgUpdate.response_metadata?.messages?.join("\n") ??
      msgUpdate.errors.map((e: Error) => e.message).join("\n")
  }`;
  console.log(errorMsg);
  return { error: errorMsg };
};