import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const MODULES_DATASTORE_NAME = "modules_datastore";

const ModulesDatastore = DefineDatastore({
  name: MODULES_DATASTORE_NAME,
  primary_key: "id",
  attributes: {
    id: {type: Schema.types.string },
    code: {type: Schema.types.string },
    name: {type: Schema.types.string },
    abbreviation:{type: Schema.types.string },
    level:{type: Schema.types.integer },
    rating: {type: Schema.types.number },
  },
});

export default ModulesDatastore;
