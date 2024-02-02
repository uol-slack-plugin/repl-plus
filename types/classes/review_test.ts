import { Review } from "./review.ts";

const mockReviews: Review[] = [
  {
      id: "1",
      user_id: "user1",
      module_id: "module1",
      title: "Review 1",
      content: "This is review 1",
      time_consumption: 4,
      rating_quality: 4,
      rating_difficulty: 3,
      rating_learning: 5,
      helpful_votes: 10,
      unhelpful_votes: 2,
      created_at: 1643675200000, // January 1, 2022
      updated_at: 1643675200000,
  },
  {
      id: "2",
      user_id: "user2",
      module_id: "module2",
      title: "Review 2",
      content: "This is review 2",
      time_consumption: 3,
      rating_quality: 5,
      rating_difficulty: 2,
      rating_learning: 4,
      helpful_votes: 8,
      unhelpful_votes: 1,
      created_at: 1643751600000, // January 2, 2022
      updated_at: 1643751600000,
  },
  {
    id: "3",
    user_id: "user3",
    module_id: "module2",
    title: "Review 3",
    content: "This is review 3",
    time_consumption: 3,
    rating_quality: 5,
    rating_difficulty: 2,
    rating_learning: 4,
    helpful_votes: 8,
    unhelpful_votes: 1,
    created_at: 1643751600001, // January 2, 2022
    updated_at: 1643751600000,
  },
  {
    id: "2",
    user_id: "user2",
    module_id: "module2",
    title: "Review 2",
    content: "This is review 2",
    time_consumption: 3,
    rating_quality: 5,
    rating_difficulty: 2,
    rating_learning: 4,
    helpful_votes: 8,
    unhelpful_votes: 1,
    created_at: 1643751600001, // January 2, 2022
    updated_at: 1643751600000,
  },
  {
    id: "2",
    user_id: "user2",
    module_id: "module2",
    title: "Review 2",
    content: "This is review 2",
    time_consumption: 3,
    rating_quality: 5,
    rating_difficulty: 2,
    rating_learning: 4,
    helpful_votes: 8,
    unhelpful_votes: 1,
    created_at: 1643751600000, // January 2, 2022
    updated_at: 1643751600000,
  },
  // Add more mock reviews as needed
];

Deno.test("filterByAverageRate filters reviews by average rate", () => {
  const filteredReviews = Review.filterByAverageRate(mockReviews, 4);
  // Add assertions to test if filteredReviews contains the expected reviews
});

Deno.test("filterByStartDate filters reviews by start date", () => {
  const filteredReviews = Review.filterByStartDate(mockReviews, 1643675200000);
  // Add assertions to test if filteredReviews contains the expected reviews
});

Deno.test("filterByEndDate filters reviews by end date", () => {
  const filteredReviews = Review.filterByEndDate(mockReviews, 1643834400000);
  // Add assertions to test if filteredReviews contains the expected reviews
});

Deno.test("sortByCreatedAtDescending sorts reviews by created_at in descending order", () => {
  const sortedReviews = Review.sortByCreatedAtDescending(mockReviews);
  // Add assertions to test if sortedReviews is sorted in descending order based on created_at
});

Deno.test("filterAndSortReviews filters and sorts reviews correctly", () => {
  const filteredAndSortedReviews = Review.filterAndSortReviews(mockReviews, 4, 1643675200000, 1643834400000);
  // Add assertions to test if filteredAndSortedReviews contains the expected reviews in the correct order
});
