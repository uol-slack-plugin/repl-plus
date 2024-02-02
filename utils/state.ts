import { Body } from "../types/body.ts";

export const getOptionValue = (
  blockId: string,
  actionId: string,
  body: Body,
): string | null => {
  return body.state.values?.[blockId]?.[actionId]?.selected_option?.value ?? null;
};

export const getValue = (
  blockId: string,
  actionId: string,
  body: Body,
): string | null => {
  return body.state.values?.[blockId]?.[actionId]?.value ?? null;
};

export const getDateValue = (
  blockId: string,
  actionId: string,
  body: Body,
): string | null => {
  return body.state.values?.[blockId]?.[actionId]?.selected_date ?? null;
};