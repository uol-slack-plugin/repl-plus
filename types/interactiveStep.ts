import {
  ParameterSetDefinition,
  PossibleParameterKeys,
} from "deno-slack-sdk/parameters/types.ts";
import { TypedWorkflowStepDefinition } from "deno-slack-sdk/workflows/workflow-step.ts";

export type InteractiveStep = <
  T extends ParameterSetDefinition,
  S extends ParameterSetDefinition,
  U extends PossibleParameterKeys<T>,
  V extends PossibleParameterKeys<S>,
>(getModulesStep: TypedWorkflowStepDefinition<T, S, U, V>) => any;

// TODO: Create a type for interactive blocks
