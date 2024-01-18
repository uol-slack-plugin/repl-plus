import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const MODULE_TYPE_NAME = "module_type"

export const ModuleType = DefineType({
  name: MODULE_TYPE_NAME,
  type: Schema.types.object,
  properties: {
    id: { type: Schema.types.string },
    code: { type: Schema.types.string },
    name: { type: Schema.types.string },
  },
  required: [],
});

export const MODULES_ARRAY_TYPE_NAME = "modules_array_type"

export const ModulesArrayType = DefineType({
  name: MODULES_ARRAY_TYPE_NAME,
  type: Schema.types.array,
  items: { type: ModuleType },
})