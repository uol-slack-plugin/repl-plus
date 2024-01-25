import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GenerateDashboardDefinition } from "./definition.ts";
import { dashboardBlocks } from "../../blocks/dashboard.ts";
import { convertUnixToDate } from "../../utils/converters.ts";
import { averageRating } from "../../utils/average_calc.ts";

export default SlackFunction(
  GenerateDashboardDefinition,
  async ({ inputs, env, client }) => {

    inputs.latest_reviews;
    const blocks = [{ ...dashboardBlocks(env) }];

    inputs.latest_reviews.forEach((review) => {
  
      // calculate module rating
      const moduleRating = averageRating(
        Number(review.rating_difficulty),
        Number(review.rating_learning),
        Number(review.rating_quality),
        Number(review.time_consumption),
        );
  
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `>*Module id: ${review.module_id} | :star: ${moduleRating}*\n> <@${review.user_id}> | ${convertUnixToDate(review.created_at)}\n\n>:thumbsup: ${review.helpful_votes || 0} | :thumbsdown: ${review.unhelpful_votes || 0}`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Read more",
            emoji: true,
          },
          value: "click_me_123",
        },
      });
    });

    await client.chat.postMessage({
      channel: inputs.user_id,
      blocks,
    });

    return { outputs: {} };
  },
);
