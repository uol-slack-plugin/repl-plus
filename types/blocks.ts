type Text = {
  type: string;
  text: string;
};

type Accessory = {
  type: string;
  text: Text;
  action_id: string;
  value: string;
};

export type Button = {
  type: string,
  text: Text,
  action_id: string;
  value: string;
}

export type Header = {
  type: string;
  text: Text;
}

export type Option = {
  text: Text;
  value: string;
};

export type ReviewBlock = {
  type: string;
  text: Text;
  accessory: Accessory;
};

export type Actions ={
  type: string;
	elements: Button[];
}

export type Select = {
    type: string;
    placeholder: Text;
    options: Option [];
    initial_option?: Option;
    action_id: string;

}

export type SelectType2 = {
  type: "input";
  block_id: string;
  element: Select;
  label: Text;
}