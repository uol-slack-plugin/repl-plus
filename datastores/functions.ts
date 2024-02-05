import {
  DatastoreDeleteResponse,
  DatastoreGetResponse,
  DatastorePutResponse,
  DatastoreQueryResponse,
  DatastoreSchema,
  DatastoreUpdateResponse,
} from "deno-slack-api/typed-method-types/apps.ts";
import { DatastoreItem, SlackAPIClient } from "deno-slack-api/types.ts";
import ReviewsDatastore from "./reviews_datastore.ts";
import ModulesDatastore from "./modules_datastore.ts";
import { Review } from "../types/classes/review.ts";
import VotesDatastore from "./votes_datastore.ts";
import { Vote } from "../types/vote.ts";

const LIMIT_QUERY_REVIEWS = 10;

// updated
/**
 * Fetch reviews with a limit argument,
 * if expression is used it might return empty arrays,
 * the next cursor might have data
 * @param client
 * @param cursor
 * @param expression
 * @returns
 */
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

/**
 * Fetch any datastore
 * @param client
 * @param datastoreName
 * @param expression
 * @returns
 */
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

/**
 * Fetch all reviews
 * @param client
 * @param expression
 * @returns
 */
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

/**
 * Fetch a review by id
 * @param client
 * @param id
 * @returns
 */
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
        id: String(review.id),
        module_id: String(review.module_id),
        title: String(review.title),
        content: String(review.content),
        time_consumption: Number(review.time_consumption),
        rating_quality: Number(review.rating_quality),
        rating_difficulty: Number(review.rating_difficulty),
        rating_learning: Number(review.rating_learning),
        helpful_votes: Number(review.helpful_votes),
        unhelpful_votes: Number(review.unhelpful_votes),
        updated_at: String(review.updated_at),
      },
    });
  return res;
}

export async function createReview(
  client: SlackAPIClient,
  review: Review,
): Promise<DatastorePutResponse<typeof ReviewsDatastore.definition>> {
  const res: DatastorePutResponse<typeof ReviewsDatastore.definition> =
    await client.apps.datastore.put<typeof ReviewsDatastore.definition>({
      datastore: ReviewsDatastore.name,
      item: {
        id: String(review.id),
        user_id: String(review.user_id),
        module_id: String(review.module_id),
        title: String(review.title),
        content: String(review.content),
        time_consumption: Number(review.time_consumption),
        rating_quality: Number(review.rating_quality),
        rating_difficulty: Number(review.rating_difficulty),
        rating_learning: Number(review.rating_learning),
        created_at: Number(review.created_at),
        updated_at: Number(review.updated_at),
        helpful_votes: String(review.helpful_votes),
        unhelpful_votes: String(review.unhelpful_votes),
      },
    });
  return res;
}

export async function deleteReview(
  client: SlackAPIClient,
  id: string,
): Promise<DatastoreDeleteResponse<typeof ReviewsDatastore.definition>> {
  const res: DatastoreDeleteResponse<typeof ReviewsDatastore.definition> =
    await client.apps.datastore.delete<typeof ReviewsDatastore.definition>({
      datastore: ReviewsDatastore.name,
      id: id,
    });
  return res;
}

export async function fetchVoteById(
  client: SlackAPIClient,
  id: string,
): Promise<DatastoreGetResponse<typeof VotesDatastore.definition>> {
  // Validate input parameters
  if (!client || !id) {
    throw new Error("Invalid input parameters for fetchVotebyId function");
  }
  const res: DatastoreGetResponse<typeof VotesDatastore.definition> =
    await client.apps.datastore.get<typeof VotesDatastore.definition>({
      datastore: VotesDatastore.name,
      id: id,
    });
  return res;
}

export async function fetchVote(
  client: SlackAPIClient,
  expression?: object,
): Promise<DatastoreQueryResponse<typeof VotesDatastore.definition>> {
  // Validate input parameters
  if (!client) {
    throw new Error("Invalid input parameters: client parameter is required");
  }

  if (expression && typeof expression !== "object") {
    throw new Error("Invalid input parameter: expression must be an object");
  }

  const items: DatastoreItem<typeof VotesDatastore.definition>[] = [];
  let cursor = undefined;
  let res: DatastoreQueryResponse<typeof VotesDatastore.definition>;

  do {
    res = await client.apps.datastore.query<typeof VotesDatastore.definition>(
      {
        datastore: VotesDatastore.name,
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

export async function createVote(
  client: SlackAPIClient,
  vote: Vote,
): Promise<DatastorePutResponse<typeof VotesDatastore.definition>> {
  // Validate input parameters
  if (!client) {
    throw new Error("Invalid input parameters: client parameter is required");
  }
  if (
    !vote || typeof vote !== "object" ||
    !vote.id || !vote.userId || !vote.reviewId ||
    !("like" in vote) || !("dislike" in vote)
  ) {
    throw new Error(
      "Invalid input parameter: vote must be an object with id, userId, reviewId, like, and dislike properties",
    );
  }

  const res: DatastorePutResponse<typeof VotesDatastore.definition> =
    await client.apps.datastore.put<typeof VotesDatastore.definition>({
      datastore: VotesDatastore.name,
      item: {
        id: String(vote.id),
        user_id: String(vote.userId),
        review_id: String(vote.reviewId),
        like: Boolean(vote.like),
        dislike: Boolean(vote.dislike),
      },
    });
  return res;
}

export async function updateVote(
  client: SlackAPIClient,
  vote: Vote,
): Promise<DatastoreUpdateResponse<typeof VotesDatastore.definition>> {
  // Validate input parameters
  if (!client) {
    throw new Error("Invalid input parameters: client parameter is required");
  }

  if (
    !vote || typeof vote !== "object" ||
    !vote.id || !vote.userId || !vote.reviewId ||
    !("like" in vote) || !("dislike" in vote)
  ) {
    throw new Error(
      "Invalid input parameter: vote must be an object with id, userId, reviewId, like, and dislike properties",
    );
  }
  const res: DatastoreUpdateResponse<typeof VotesDatastore.definition> =
    await client.apps.datastore.update<typeof VotesDatastore.definition>({
      datastore: VotesDatastore.name,
      item: {
        id: String(vote.id),
        user_id: String(vote.userId),
        review_id: String(vote.reviewId),
        like: Boolean(vote.like),
        dislike: Boolean(vote.dislike),
      },
    });
  return res;
}

////////////////////////////////////////////////////////////////////////////////////////////
// deprecated
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
