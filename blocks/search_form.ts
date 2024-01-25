import { DatastoreItem } from "deno-slack-api/types.ts";
import ReviewsDatastore from "../datastores/reviews_datastore.ts";

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
        action_id: "static_select-action",
      },
    },
    {
      type: "actions",
      block_id: "so-inspired",
      elements: [{
        type: "button",
        text: {
          type: "plain_text",
          text: "Post",
        },
        action_id: "post_quote",
      }],
    }
  ];
};
