import { DatastoreGetResponse, DatastoreQueryResponse, DatastoreSchema } from "deno-slack-api/typed-method-types/apps.ts";
import { BaseResponse } from "deno-slack-api/types.ts";

export function handleResError<T extends DatastoreSchema>(
  res: DatastoreQueryResponse<T>| DatastoreGetResponse<T>,
  errorMsg: string
): { error: string } {

  const errorMessage = `${errorMsg} (Error detail: ${res.error})`;
  console.error(errorMessage);
  return { error: errorMessage };
};

export const handleChatError = (
  msgUpdate:BaseResponse
) => {
  const errorMsg = `Error during chat.update!", ${
    msgUpdate.response_metadata?.messages?.join("\n") ??
      msgUpdate.errors.map((e: Error) => e.message).join("\n")
  }`;
  console.log(errorMsg);
  return { error: errorMsg };
};