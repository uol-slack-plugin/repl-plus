import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "deno-slack-sdk/parameters/types.ts";
import { TypedWorkflowStepDefinition } from "deno-slack-sdk/workflows/workflow-step.ts";
import { InteractiveBlocks } from "./interactive_blocks.ts";

export type InteractiveStep = <
  T extends ParameterSetDefinition,
  S extends ParameterSetDefinition,
  U extends PossibleParameterKeys<T>,
  V extends PossibleParameterKeys<S>,
>(getModulesStep: TypedWorkflowStepDefinition<T, S, U, V>) => InteractiveBlocks;