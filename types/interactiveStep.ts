import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "deno-slack-sdk/parameters/types.ts";
import { TypedWorkflowStepDefinition } from "deno-slack-sdk/workflows/workflow-step.ts";
import { InteractiveBlocks } from "./InteractiveBlock.ts";

export type InteractiveStep = <
  T extends ParameterSetDefinition,
  S extends ParameterSetDefinition,
  U extends PossibleParameterKeys<T>,
  V extends PossibleParameterKeys<S>,
>(getModulesStep: TypedWorkflowStepDefinition<T, S, U, V>) => InteractiveBlocks;

// TODO: Create a type for interactive blocks
