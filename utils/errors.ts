import { DatastoreGetResponse, DatastoreQueryResponse, DatastoreSchema } from "deno-slack-api/typed-method-types/apps.ts";
import { BaseResponse } from "deno-slack-api/types.ts";

export function handleResError<T extends DatastoreSchema>(
  res: DatastoreQueryResponse<T>| DatastoreGetResponse<T>,
  errorMsg?: string
): never {
  if (!res || !res.error) {
    throw new Error('Invalid response object: res.error is missing or falsy');
  }
  const errorMessage = res.error;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const handleChatError = (msgUpdate: BaseResponse): never => {
  if (!msgUpdate) {
    throw new Error('Invalid input: msgUpdate parameter is missing or falsy');
  }

  const errorMsg = `Error during chat.update! ${
    msgUpdate.response_metadata?.messages?.join("\n") ??
    msgUpdate.errors.map((e: Error) => e.message).join("\n")
  }`;
  console.error(errorMsg);
  throw new Error(errorMsg);
};