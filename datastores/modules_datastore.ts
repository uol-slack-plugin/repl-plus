import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const MODULES_DATASTORE_NAME = "Modules"

const ModulesDatastore = DefineDatastore({
  name: MODULES_DATASTORE_NAME,
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