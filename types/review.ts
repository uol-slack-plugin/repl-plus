import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";

export class Review {
  id: string;
  user_id: string;
  module_id: string;
  title: string;
  content: string;
  time_consumption: number;
  rating_quality: number;
  rating_difficulty: number;
  rating_learning: number;
  helpful_votes: number | null;
  unhelpful_votes: number | null;
  created_at: number;
  updated_at: number;

  constructor(
    id: string,
    user_id: string,
    module_id: string,
    title: string,
    content: string,
    time_consumption: number,
    rating_quality: number,
    rating_difficulty: number,
    rating_learning: number,
    helpful_votes: number | null,
    unhelpful_votes: number | null,
    created_at: number,
    updated_at: number,
  ) {
    this.id = id;
    this.user_id = user_id;
    this.module_id = module_id;
    this.title = title;
    this.content = content;
    this.time_consumption = time_consumption;
    this.rating_quality = rating_quality;
    this.rating_difficulty = rating_difficulty;
    this.rating_learning = rating_learning;
    this.helpful_votes = helpful_votes;
    this.unhelpful_votes = unhelpful_votes;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  public static constructReviewsFromDatastore(
    datastoreReviews: DatastoreItem<typeof ReviewsDatastore.definition>[],
  ): Review[] {
    const reviews: Review[] = [];

    datastoreReviews.forEach((reviewItem) => {
      reviews.push(
        new Review(
          String(reviewItem.id),
          String(reviewItem.user_id),
          String(reviewItem.module_id),
          String("Title Sample"),
          String(reviewItem.review), // TO DO: change datastore attribute
          Number(reviewItem.time_consumption),
          Number(reviewItem.rating_quality),
          Number(reviewItem.rating_difficulty),
          Number(reviewItem.rating_learning),
          Number(reviewItem.helpful_votes),
          Number(reviewItem.unhelpful_votes),
          Number(reviewItem.created_at),
          Number(reviewItem.updated_at),
        ),
      );
    });

    return reviews;
  }
}
