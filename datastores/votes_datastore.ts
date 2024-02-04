import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const VOTES_DATASTORE_NAME = "votes_datastore";

const VotesDatastore = DefineDatastore({
  name: VOTES_DATASTORE_NAME,
  primary_key: "id",
  attributes: {
    id: {type: Schema.types.string, },
    review_id: {type: Schema.types.string },
    user_id: {type: Schema.types.string},
    like: {type: Schema.types.boolean, default: false },
    dislike:{type: Schema.types.boolean, default: false },
  },
});

export default VotesDatastore;
