import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import { deleteReview } from "../../../datastores/functions.ts";

export default async function DeleteReviewController(
  client: SlackAPIClient,
  reviewId: string,
) {

  const res = await deleteReview(client,reviewId);
  if (!res.ok) return {error: `Error at deleting review, (Error detail: ${res.error})`};
}
