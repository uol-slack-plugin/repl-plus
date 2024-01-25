import { Env } from "deno-slack-sdk/types.ts";

export const dashboardBlocks = (env: Env): any => (
  {
    type: "actions",
    elements: [{
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
    }, {
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
    }, {
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
    }],
  }
);
