import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const ModulesDatastore = DefineDatastore({
  name: "Modules",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    code: {
      type: Schema.types.string,
    },
    name: {
      type: Schema.types.string,
    },
    rating: {
      type: Schema.types.number,
    },
  },
});

export default ModulesDatastore;