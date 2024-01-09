import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const DashboardBlockFunctionDefinition = DefineFunction({
  callback_id: "dashboard_block_function",
  title: "Dashboard block function",
  source_file: "functions/dashboard_block_function.ts",

  output_parameters: {
    properties: {
      blocks: {
        type: Schema.slack.types.blocks,
      },
    },
    required: ["blocks"],
  },
});

export default SlackFunction(DashboardBlockFunctionDefinition, ({ env }) => {
  const blocks = [
    {
      type: "actions",
      elements: [
        {
          type: "workflow_button",
          text: {
            type: "plain_text",
            text: "Create a Review",
          },
          workflow: {
            trigger: {
              url: env["CREATE_REVIEW_WORKFLOW_URL"],
            },
          },
        },
        {
          type: "workflow_button",
          text: {
            type: "plain_text",
            text: "Edit a Review",
          },
          workflow: {
            trigger: {
              url: env["EDIT_REVIEW_WORKFLOW_URL"],
            },
          },
        },
        {
          type: "workflow_button",
          text: {
            type: "plain_text",
            text: "Find a Review",
          },
          workflow: {
            trigger: {
              url: env["FIND_REVIEW_WORKFLOW_URL"],
            },
          },
        },
      ],
    },
  ];

  return { outputs: { blocks } };
});
