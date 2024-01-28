export enum EntryType {
  Create,
  Edit,
}

export class ReviewEntry {
  module_id: string | null;
  rating_quality: string | null;
  rating_difficulty: string | null;
  time_consumption: string | null;
  rating_learning: string | null;
  title: string | null;
  content: string | null;
  type: EntryType;

  constructor(
    module_id: string | null,
    rating_quality: string | null,
    rating_difficulty: string | null,
    time_consumption: string | null,
    rating_learning: string | null,
    title: string | null,
    content: string | null,
    type: EntryType,
  ) {
    this.module_id = module_id;
    this.rating_quality = rating_quality;
    this.rating_difficulty = rating_difficulty;
    this.time_consumption = time_consumption;
    this.rating_learning = rating_learning;
    this.title = title;
    this.content = content;
    this.type = type;
  }
  public static constructReviewEntryFromStatus(
    // deno-lint-ignore no-explicit-any
    body: any,
    moduleID: string,
    moduleActionID: string,
    qualityRatingID: string,
    qualityRatingActionID: string,
    difficultyRatingID: string,
    difficultyRatingActionID: string,
    timeRatingID: string,
    timeRatingActionID: string,
    learningRatingID: string,
    learningRatingActionID: string,
    titleID: string,
    titleActionID: string,
    contentID: string,
    contentActionID: string,
    type: EntryType,
  ): ReviewEntry {
    return new ReviewEntry(
      body.state.values?.[moduleID]?.[moduleActionID]?.selected_option?.value ??
        null,
      body.state.values?.[qualityRatingID]?.[qualityRatingActionID]
        ?.selected_option?.value ?? null,
      body.state.values?.[difficultyRatingID]?.[difficultyRatingActionID]
        ?.selected_option?.value ?? null,
      body.state.values?.[timeRatingID]?.[timeRatingActionID]?.selected_option
        ?.value ?? null,
      body.state.values?.[learningRatingID]?.[learningRatingActionID]
        ?.selected_option?.value ?? null,
      body.state.values?.[titleID]?.[titleActionID]?.value ?? null,
      body.state.values?.[contentID]?.[contentActionID]?.value ?? null,
      type,
    );
  }

  /**
   * Check if the entry passes the following conditions:
   * - not empty strings
   * - not undefined values
   * - parse to null
   * @param reviewEntry
   * @returns
   */
  public static validateReviewEntry(
    reviewEntry: ReviewEntry,
  ): { pass: boolean; reviewEntry: ReviewEntry } {
    let pass = true;

    // not empty strings
    if (reviewEntry.title === "") pass = false;
    if (reviewEntry.content === "") pass = false;

    // not null values
    for (const key in reviewEntry) {
      // Skip validation for module_id if it's editing
      if (
        key === "module_id" && reviewEntry.type === EntryType.Edit &&
        reviewEntry[key as keyof ReviewEntry] === null
      ) continue;

      if (reviewEntry[key as keyof ReviewEntry] === null) {
        pass = false;
      }
    }
    return { pass, reviewEntry };
  }
}
