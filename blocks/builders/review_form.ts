import { Module } from "../../types/module.ts";

export const header = (title: string) => [
  {
    type: "header",
    text: {
      type: "plain_text",
      text: title,
    },
  },
];

export const info = () => [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "*On a scale of one to five, with one being low and 5 being high, how would you rate this course on its:*",
    },
  },
];

export const generateSelectType1 = (
  text: string,
  placeholder: string,
  options: string[] | Module[],
  blockId: string,
  actionId: string,
) => {
  return [
    {
      type: "section",
      block_id: blockId,
      text: {
        type: "mrkdwn",
        text: text,
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          text: placeholder,
        },
        options: createOptions(options),
        action_id: actionId,
      },
    },
  ];
};

export const generateSelectType2 = (
  label: string,
  placeholder: string,
  options: string[] | Module[],
  blockId: string,
  actionId: string,
) => {
  return [
    {
      type: "input",
      block_id: blockId,
      element: {
        type: "static_select",
        placeholder: {
          "type": "plain_text",
          "text": placeholder,
        },
        options: createOptions(options),
        action_id: actionId,
      },
      label: {
        type: "plain_text",
        text: label,
      },
    },
  ];
};

export const generateInput = (
  label: string,
  multiline: boolean,
  blockId: string,
  actionId: string,
) => [
  {
    type: "input",
    block_id: blockId,
    label: {
      type: "plain_text",
      text: label,
    },
    element: {
      type: "plain_text_input",
      multiline: multiline,
      action_id: actionId,
    },
  },
];

export const submitAndCancelButtons = (
  cancelActionId: string,
  submitActionId: string,
  modules: Module[],
) => [{
  type: "actions",
  elements: [
    {
      type: "button",
      text: {
        type: "plain_text",
        text: "Cancel",
      },
      action_id: cancelActionId,
    },

    {
      type: "button",
      text: {
        type: "plain_text",
        text: "Submit",
      },
      action_id: submitActionId,
      value: JSON.stringify(modules),
    },
  ],
}];

export const validationAlert = () => [{
  type: "context",
  elements: [
    {
      type: "plain_text",
      text: "Please fill out the required field *",
    },
  ],
}];

const createOptions = (
  options: string[] | Module[],
): any[] => {
  return options.map((option) => {
    if (typeof option === "string") {
      return {
        text: {
          type: "plain_text",
          text: option,
        },
        value: option,
      };
    } else {
      return {
        text: {
          type: "plain_text",
          text: option.name,
        },
        value: option.id,
      };
    }
  });
};
