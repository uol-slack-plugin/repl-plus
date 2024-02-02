type Search = {
  moduleId: string | null;
  averageRating: number | null;
  startDate: number | null;
  endDate: number | null;
}


export interface Metadata {
  pages: string[];
  cursors: (string | null)[];
  search? :Search;
}