import {
  DatastoreGetResponse,
  DatastoreQueryResponse,
  DatastoreSchema,
  DatastoreUpdateResponse,
} from "deno-slack-api/typed-method-types/apps.ts";
import { DatastoreItem, SlackAPIClient } from "deno-slack-api/types.ts";
import ReviewsDatastore from "./reviews_datastore.ts";
import ModulesDatastore from "./modules_datastore.ts";
import { Review } from "../types/review.ts";

const LIMIT_QUERY_REVIEWS = 2;

export async function fetchReviewsLimited(
  client: SlackAPIClient,
  cursor?: string,
  expression?: object,
): Promise<DatastoreQueryResponse<typeof ReviewsDatastore.definition>> {
  const res: DatastoreQueryResponse<typeof ReviewsDatastore.definition> =
    await client.apps.datastore.query<typeof ReviewsDatastore.definition>({
      datastore: ReviewsDatastore.name,
      limit: LIMIT_QUERY_REVIEWS,
      cursor,
      ...expression,
    });
  return res;
}

export async function fetch<T extends DatastoreSchema>(
  client: SlackAPIClient,
  datastoreName: string,
  expression?: object,
): Promise<DatastoreQueryResponse<T>> {
  const items: DatastoreItem<T>[] = [];
  let cursor = undefined;
  let res: DatastoreQueryResponse<T>;

  do {
    res = await client.apps.datastore.query<T>({
      datastore: datastoreName,
      cursor,
      ...expression,
    });

    cursor = res.response_metadata?.next_cursor;
    items.push(...res.items);

    if (!res.ok) break;
  } while (cursor);
  res.items = [...items];
  return res;
}

export async function fetchReviews(
  client: SlackAPIClient,
  expression?: object,
): Promise<DatastoreQueryResponse<typeof ReviewsDatastore.definition>> {
  const items: DatastoreItem<typeof ReviewsDatastore.definition>[] = [];
  let cursor = undefined;
  let res: DatastoreQueryResponse<typeof ReviewsDatastore.definition>;

  do {
    res = await client.apps.datastore.query<typeof ReviewsDatastore.definition>(
      {
        datastore: ReviewsDatastore.name,
        cursor,
        ...expression,
      },
    );

    cursor = res.response_metadata?.next_cursor;
    items.push(...res.items);

    if (!res.ok) break;
  } while (cursor);
  res.items = [...items];
  return res;
}

export async function fetchReview(
  client: SlackAPIClient,
  id: string,
): Promise<DatastoreGetResponse<typeof ReviewsDatastore.definition>> {
  const res: DatastoreGetResponse<typeof ReviewsDatastore.definition> =
    await client.apps.datastore.get<typeof ReviewsDatastore.definition>({
      datastore: ReviewsDatastore.name,
      id: id,
    });
  return res;
}

export async function updateReview(
  client: SlackAPIClient,
  review: Review,
): Promise<DatastoreUpdateResponse<typeof ReviewsDatastore.definition>> {
  const res: DatastoreUpdateResponse<typeof ReviewsDatastore.definition> =
    await client.apps.datastore.update<typeof ReviewsDatastore.definition>({
      datastore: ReviewsDatastore.name,
      item: {
        id: review.id,
        module_id: review.module_id,
        title: review.title,
        content: review.content,
        time_consumption: review.time_consumption,
        rating_quality: review.rating_quality,
        rating_difficulty: review.rating_difficulty,
        rating_learning: review.rating_learning,
        updated_at: review.updated_at,
      },
    });
  return res;
}

export async function queryAllReviews(
  client: SlackAPIClient,
  expression?: object,
): Promise<{
  ok: boolean;
  items: DatastoreItem<typeof ReviewsDatastore.definition>[];
  error?: string;
}> {
  const items: DatastoreItem<typeof ReviewsDatastore.definition>[] = [];
  let cursor = undefined;

  do {
    // query reviews
    const reviewsResponse: DatastoreQueryResponse<
      typeof ReviewsDatastore.definition
    > = await client.apps.datastore.query<typeof ReviewsDatastore.definition>({
      datastore: ReviewsDatastore.name,
      limit: LIMIT_QUERY_REVIEWS,
      cursor,
      ...expression,
    });

    if (!reviewsResponse.ok) {
      return { ok: false, items, error: reviewsResponse.error };
    }
    cursor = reviewsResponse.response_metadata?.next_cursor;
    items.push(...reviewsResponse.items);
  } while (cursor);

  return {
    ok: true,
    items,
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
