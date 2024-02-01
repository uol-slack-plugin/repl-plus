import { Metadata } from "../types/metadata.ts";

// Type guard to check if an object is of type Metadata
export function isMetadata(obj: any): obj is Metadata {
  return typeof obj === 'object' && obj !== null && 'pages' in obj && 'cursors' in obj;
}