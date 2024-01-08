export const view = {
  "type": "modal",
  // Note that this ID can be used for dispatching view submissions and view closed events.
  "callback_id": "edit-review",
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
            "text": "Home Page",
            "emoji": true,
          },
          "value": "click_me_123",
          "url":
            " https://slack.com/shortcuts/Ft06CP0ZDP8D/897c9f996ca1543286cf801742618d0f",
        },
      ],
    },
  ],
};
