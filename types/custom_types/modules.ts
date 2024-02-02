import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

const Module = DefineType({
  name: "Module",
  type: Schema.types.object,
  properties: {
    id: { type: Schema.types.string },
    code: { type: Schema.types.string },
    name: { type: Schema.types.string },
    rating: { type: Schema.types.number },
  },
  required: ["id", "code","name"],
});

// Define the array with the items as the custom type
export const ModulesArray = DefineType({
  name: "ModulesArray",
  type: Schema.types.array,
  items: {
    type: Module,
  },
});
