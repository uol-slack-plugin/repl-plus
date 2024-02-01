export interface Metadata {
  pages: string[];
  cursors: (string | null)[];
  // deno-lint-ignore no-explicit-any
  payload? :any;
}