import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";
import {
CANCEL_BUTTON,
  SEARCH_REVIEWS,
  SELECT_MOD_A_ID,
  SELECT_MOD_B_ID,
} from "../functions/generate_dashboard/constants.ts";

export const searchFormBlocks = (
  modules: DatastoreItem<typeof ReviewsDatastore.definition>[],
) => {
  const options: any[] = [];

  modules.forEach((module) => {
    options.push({
      text: {
        type: "plain_text",
        text: "module id: " + module.id,
        emoji: true,
      },
      value: module.id,
    });
  });

  return [
    {
      type: "section",
      block_id: SELECT_MOD_B_ID,
      text: {
        type: "mrkdwn",
        text: "Pick an item from the dropdown list",
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: "Select an item",
          emoji: true,
        },
        options: options,
        action_id: SELECT_MOD_A_ID,
      },
    },

    {
      type: "actions",
      block_id: "so-inspired",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Cancel",
          },
          action_id: CANCEL_BUTTON,
        },

        
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Submit",
          },
          action_id: SEARCH_REVIEWS,
        },
      ],
    },
  ];
};
