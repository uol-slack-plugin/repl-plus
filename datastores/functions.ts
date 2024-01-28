import { DatastoreQueryResponse } from "deno-slack-api/typed-method-types/apps.ts";
import { SlackAPIClient, DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "./reviews_datastore.ts";
import ModulesDatastore from "./modules_datastore.ts";

const LIMIT_QUERY_REVIEWS = 5;

export async function queryReviewDatastore(
  client: SlackAPIClient,
  cursor: string | undefined = undefined,
): Promise<{
  ok: boolean;
  items: DatastoreItem<typeof ReviewsDatastore.definition>[];
  error?: string;
  // deno-lint-ignore no-explicit-any
  response_metadata?: any | undefined;
}> {
  const items: DatastoreItem<
    typeof ReviewsDatastore.definition
  >[] = [];

  // query reviews
  const reviewsResponse: DatastoreQueryResponse<
    typeof ReviewsDatastore.definition
  > = await client.apps.datastore.query<typeof ReviewsDatastore.definition>({
    datastore: ReviewsDatastore.name,
    limit: LIMIT_QUERY_REVIEWS,
    cursor,
  });

  if (!reviewsResponse.ok) {
    return { ok: false, items, error: reviewsResponse.error };
  }

  return {
    ok: true,
    items: reviewsResponse.items,
    response_metadata: reviewsResponse.response_metadata,
  };
}

export async function queryDatastoresAndFilterUserModules(
  client: SlackAPIClient,
  userId: string,
): Promise<{
  ok: boolean;
  modulesNotReviewed: DatastoreItem<typeof ModulesDatastore.definition>[];
  error?: string;
}> {
  const modulesNotReviewed: DatastoreItem<
    typeof ModulesDatastore.definition
  >[] = [];

  // query modules
  const modules: DatastoreQueryResponse<typeof ModulesDatastore.definition> =
    await client.apps.datastore.query<typeof ModulesDatastore.definition>({
      datastore: ModulesDatastore.name,
    });

  if (!modules.ok) {
    return { ok: false, modulesNotReviewed, error: modules.error };
  }

  // query reviews
  const userReviews: DatastoreQueryResponse<
    typeof ReviewsDatastore.definition
  > = await client.apps.datastore.query<typeof ReviewsDatastore.definition>({
    datastore: ReviewsDatastore.name,
    expression: "#user_id = :user_id",
    expression_attributes: { "#user_id": "user_id" },
    expression_values: { ":user_id": userId },
  });

  if (!userReviews.ok) {
    return { ok: false, modulesNotReviewed, error: modules.error };
  }

  // filter user modules, compare ids and get non matching objects
  modulesNotReviewed.push(
    ...modules.items.filter((
      m: DatastoreItem<typeof ModulesDatastore.definition>,
    ) =>
      !userReviews.items.some((
        r: DatastoreItem<typeof ReviewsDatastore.definition>,
      ) => m.id === r.module_id)
    ).filter((m) => m.name),
  );

  return { ok: true, modulesNotReviewed };
}