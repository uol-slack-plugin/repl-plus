export interface Metadata {
  pages: string[];
  cursors: string[];
  expression: object | undefined;
  // deno-lint-ignore no-explicit-any
  payload? :any;
  // deno-lint-ignore no-explicit-any
  temp?: any;
}