import { ReviewEntry } from "./classes/review_entry.ts";

export type Validation ={
  pass: boolean;
  reviewEntry: ReviewEntry;
  error?: string;
}