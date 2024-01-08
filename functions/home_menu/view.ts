export const view = {
  "type": "modal",
  // Note that this ID can be used for dispatching view submissions and view closed events.
  "callback_id": "home-page",
  // This option is required to be notified when this modal is closed by the user
  "notify_on_close": true,
  "title": { "type": "plain_text", "text": "REPL PLUS" },
  "blocks": [
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Create Review",
            "emoji": true,
          },
          "value": "click_me_123",
          "url":
            "https://slack.com/shortcuts/Ft06CTH6EZ0S/1d5864d718de2097db6d36c01ae831f2",
        },
      ],
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Edit Review",
            "emoji": true,
          },
          "value": "click_me_123",
          "url":
            "https://slack.com/shortcuts/Ft06CTH6EZ0S/1d5864d718de2097db6d36c01ae831f2",
        },
      ],
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Find Review",
            "emoji": true,
          },
          "value": "click_me_123",
          "url":
            "https://slack.com/shortcuts/Ft06CTH6EZ0S/1d5864d718de2097db6d36c01ae831f2",
        },
      ],
    },
  ],
};
