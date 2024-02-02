import { Metadata } from "../types/metadata.ts";

// Type guard to check if an object is of type Metadata
export function isMetadata(obj: any): obj is Metadata {
  return typeof obj === 'object' && obj !== null && 'pages' in obj && 'cursors' in obj;
}

// Type guard to check if an object has a 'validation' property
export function hasValidationProperty(obj: any): obj is { validation: boolean } {
    return typeof obj === 'object' && obj !== null && 'validation' in obj;
}

// Type guard to check if an object has an 'error' property
export function hasErrorProperty(obj: any): obj is { error: string } {
  return typeof obj === 'object' && obj !== null && 'error' in obj;
}