import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const MODULE_TYPE_NAME = "module_type";

export const Module = DefineType({
  name: MODULE_TYPE_NAME,
  type: Schema.types.object,
  properties: {
    id: { type: Schema.types.string },
    code: { type: Schema.types.string },
    name: { type: Schema.types.string },
    rating: { type: Schema.types.number },
  },
  required: ["id", "name", "code"],
});

export type Module = {
  id: string,
  code: string,
  name: string,
  rating: string,
}