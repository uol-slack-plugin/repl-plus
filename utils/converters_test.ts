import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { convertDifficultyRatingToInt, convertIntToDifficultyRating, convertIntToRating, convertIntToTimeRating, convertRatingToInt, convertTimeRatingToInt } from "./converters.ts";
import { DifficultyRating, Rating, TimeRating } from "../types/rating.ts";

// TEST 1
Deno.test("should return a number for a valid rating", ()=>{
  assertEquals(convertRatingToInt(Rating.Poor), 1);
  assertEquals(convertRatingToInt(Rating.Lacking), 2);
  assertEquals(convertRatingToInt(Rating.Ok), 3);
  assertEquals(convertRatingToInt(Rating.Good), 4);
  assertEquals(convertRatingToInt(Rating.Excellent), 5);
})

// TEST 2
Deno.test("should return 0 for an invalid rating", ()=>{
  assertEquals(convertRatingToInt("return zero"), 0);
})

// TEST 3
Deno.test("should return a number for a valid time rating", ()=>{
  assertEquals(convertTimeRatingToInt(TimeRating.NONE), 1);
  assertEquals(convertTimeRatingToInt(TimeRating.LITTLE), 2);
  assertEquals(convertTimeRatingToInt(TimeRating.MODERATE), 3);
  assertEquals(convertTimeRatingToInt(TimeRating.ABOVE_AVERAGE), 4);
  assertEquals(convertTimeRatingToInt(TimeRating.A_LOT), 5);
})

// TEST 4
Deno.test("should return 0 for an invalid time rating", ()=>{
  assertEquals(convertTimeRatingToInt("return zero"), 0);
})


// TEST 5
Deno.test("should return a number for a valid difficulty rating", ()=>{
  assertEquals(convertDifficultyRatingToInt(DifficultyRating.NO_EFFORT), 1);
  assertEquals(convertDifficultyRatingToInt(DifficultyRating.EASY), 2);
  assertEquals(convertDifficultyRatingToInt(DifficultyRating.AVERAGE), 3);
  assertEquals(convertDifficultyRatingToInt(DifficultyRating.CHALLENGING), 4);
  assertEquals(convertDifficultyRatingToInt(DifficultyRating.HARD), 5);
})

// TEST 6
Deno.test("should return 0 for an invalid difficulty rating", ()=>{
  assertEquals(convertDifficultyRatingToInt("return zero"), 0);
})

// TEST 7
Deno.test("should return a rating for a valid number", ()=>{
  assertEquals(convertIntToRating(1), Rating.Poor);
  assertEquals(convertIntToRating(2), Rating.Lacking);
  assertEquals(convertIntToRating(3), Rating.Ok);
  assertEquals(convertIntToRating(4), Rating.Good);
  assertEquals(convertIntToRating(5), Rating.Excellent);
})

// TEST 8
Deno.test("should return an average rating for invalid number rating", ()=>{
  assertEquals(convertIntToRating(-5), Rating.Ok);
})

// TEST 9
Deno.test("should return a rating for a valid number", ()=>{
  assertEquals(convertIntToDifficultyRating(1), DifficultyRating.NO_EFFORT);
  assertEquals(convertIntToDifficultyRating(2), DifficultyRating.EASY);
  assertEquals(convertIntToDifficultyRating(3), DifficultyRating.AVERAGE);
  assertEquals(convertIntToDifficultyRating(4), DifficultyRating.CHALLENGING);
  assertEquals(convertIntToDifficultyRating(5), DifficultyRating.HARD);
})

// TEST 10
Deno.test("should return an average rating for invalid number rating", ()=>{
  assertEquals(convertIntToDifficultyRating(-5), DifficultyRating.AVERAGE);
})

// TEST 11
Deno.test("should return a rating for a valid number", ()=>{
  assertEquals(convertIntToTimeRating(1), TimeRating.NONE);
  assertEquals(convertIntToTimeRating(2), TimeRating.LITTLE);
  assertEquals(convertIntToTimeRating(3), TimeRating.MODERATE);
  assertEquals(convertIntToTimeRating(4), TimeRating.ABOVE_AVERAGE);
  assertEquals(convertIntToTimeRating(5), TimeRating.A_LOT);
})

// TEST 12
Deno.test("should return an average rating for invalid number rating", ()=>{
  assertEquals(convertIntToTimeRating(-1), TimeRating.MODERATE);
})

