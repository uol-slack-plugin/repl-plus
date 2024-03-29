import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

const Module = DefineType({
  name: "Module",
  type: Schema.types.object,
  properties: {
    id: {type: Schema.types.string },
    code: {type: Schema.types.string },
    name: {type: Schema.types.string },
    abbreviation:{type: Schema.types.string },
    level:{type: Schema.types.integer },
    rating: {type: Schema.types.number },
  },
  required: ["id", "code","name","abbreviation","level"],
});

// Define the array with the items as the custom type
export const Modules = DefineType({
  name: "ModulesArray",
  type: Schema.types.array,
  items: {
    type: Module,
  },
});
