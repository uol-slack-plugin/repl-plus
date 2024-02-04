type PlainText = {
  type: "plain_text";
  text: string;
};

type Mrkdwn = {
  type: "mrkdwn";
  text: string;
};

type StaticSelect = {
  type: "static_select";
  placeholder: PlainText;
  options: Option[];
  initial_option?: Option;
  action_id: string;
};

type PlainTextInput = {
  type: "plain_text_input";
  multiline: boolean;
  action_id: string;
  initial_value?: string;
};

type Image = {
  type: "image";
  image_url: string;
  alt_text: string;
};

type Datepicker = {
  type: "datepicker";
  initial_date: string;
  placeholder: PlainText;
  action_id: string;
};

export enum ButtonStyle {
  Primary = "primary",
  Danger = "danger",
  Default = "default",
}

export type Button = {
  type: "button";
  text: PlainText;
  action_id: string;
  value: string;
  confirm?: Confirm;
  style? : ButtonStyle
};

export type Header = {
  type: "header";
  text: PlainText;
};

export type Option = {
  text: PlainText;
  value: string;
};

export type Context = {
  type: "context";
  elements: PlainText[]| Mrkdwn[];
};


export type Actions = {
  type: "actions";
  elements: Button[];
};

export type Section = {
  type: "section";
  text?: PlainText | Mrkdwn;
  accessory?: Button | StaticSelect | Image | Datepicker;
  block_id?: string;
  fields?: Mrkdwn[];
};

export type Input = {
  type: "input";
  block_id: string;
  element: StaticSelect | PlainTextInput;
  label: PlainText;
};

export type Confirm = {
  title: PlainText;
  text: PlainText;
  confirm: PlainText;
  deny: PlainText;
};
