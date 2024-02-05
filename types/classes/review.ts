import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../../datastores/reviews_datastore.ts";
import { averageRating } from "../../utils/average_calc.ts";

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
  helpful_votes: number;
  unhelpful_votes: number;
  created_at: string;
  updated_at: string;

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
    helpful_votes: number,
    unhelpful_votes: number,
    created_at: string,
    updated_at: string,
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

  public static constructReview(
    review: DatastoreItem<typeof ReviewsDatastore.definition>,
  ): Review {
    return new Review(
      String(review.id),
      String(review.user_id),
      String(review.module_id),
      String(review.title),
      String(review.content),
      Number(review.time_consumption),
      Number(review.rating_quality),
      Number(review.rating_difficulty),
      Number(review.rating_learning),
      Number(review.helpful_votes),
      Number(review.unhelpful_votes),
      String(review.created_at),
      String(review.updated_at),
    );
  }

  public static constructReviews(
    datastoreReviews: DatastoreItem<typeof ReviewsDatastore.definition>[],
  ): Review[] {
    const reviews: Review[] = [];
    datastoreReviews.forEach((reviewItem) => {
      reviews.push(
        new Review(
          String(reviewItem.id),
          String(reviewItem.user_id),
          String(reviewItem.module_id),
          String(reviewItem.title),
          String(reviewItem.content),
          Number(reviewItem.time_consumption),
          Number(reviewItem.rating_quality),
          Number(reviewItem.rating_difficulty),
          Number(reviewItem.rating_learning),
          Number(reviewItem.helpful_votes),
          Number(reviewItem.unhelpful_votes),
          String(reviewItem.created_at),
          String(reviewItem.updated_at),
        ),
      );
    });
    return reviews;
  }

  // Function to filter reviews by average rate
  public static filterByAverageRate(
    reviews: Review[],
    averageRate: number | null,
  ): Review[] {
    if (averageRate === null) {
      return reviews;
    }
    return reviews.filter((review) => {
      const average = averageRating(
        review.time_consumption,
        review.rating_quality,
        review.rating_difficulty,
        review.rating_learning,
      );
      return average >= averageRate;
    });
  }

  // Function to filter reviews by start date
  public static filterByStartDate(
    reviews: Review[],
    startDate: number | null,
  ): Review[] {
    if (startDate === null) {
      return reviews;
    }
    return reviews.filter((review) => Number(review.created_at) >= startDate);
  }

  // Function to filter reviews by end date
  public static filterByEndDate(
    reviews: Review[],
    endDate: number | null,
  ): Review[] {
    if (endDate === null) {
      return reviews;
    }
    return reviews.filter((review) => Number(review.created_at) <= endDate);
  }

  // Function to sort reviews by created_at in descending order using quicksort
  public static sortByCreatedAtDescending(reviews: Review[]): Review[] {
    if (reviews.length <= 1) {
      return reviews;
    }

    const pivot = reviews[Math.floor(reviews.length / 2)];
    const left = reviews.filter((review) =>
      review.created_at > pivot.created_at
    );
    const middle = reviews.filter((review) =>
      review.created_at === pivot.created_at
    );
    const right = reviews.filter((review) =>
      review.created_at < pivot.created_at
    );

    return [
      ...Review.sortByCreatedAtDescending(left),
      ...middle,
      ...Review.sortByCreatedAtDescending(right),
    ];
  }

  // Function to apply filters and sorting to reviews
  public static filterAndSortReviews(
    reviews: Review[],
    averageRate: number | null,
    startDate: number | null,
    endDate: number | null,
  ): Review[] {
    let filteredReviews = Review.filterByAverageRate(reviews, averageRate);
    filteredReviews = Review.filterByStartDate(filteredReviews, startDate);
    filteredReviews = Review.filterByEndDate(filteredReviews, endDate);
    return Review.sortByCreatedAtDescending(filteredReviews);
  }
}
