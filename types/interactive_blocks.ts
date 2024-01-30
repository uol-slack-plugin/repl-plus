interface InteractiveBlockBase {
  type: string;
}

interface StringInputBlock extends InteractiveBlockBase {
  type: "input";
  block_id: string;
  label: {
    type: string;
    text: string;
  };
  element: {
    type: string;
    action_id: string;
  };
}

export type InteractiveBlock =
  | InteractiveBlockBase
  | StringInputBlock;

export interface InteractiveBlocks {
  elements: InteractiveBlock[];
  required: string[];
}