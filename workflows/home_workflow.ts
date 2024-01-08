import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { HomeMenuFunction } from "../functions/home_menu/mod.ts";

const HomeWorkflow = DefineWorkflow({
  callback_id: "home_workflow",
  title: "Repl plus workflow",
  description: "An application that lets you read and review UoL modules",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

HomeWorkflow.addStep(HomeMenuFunction, {
  interactivity: HomeWorkflow.inputs.interactivity,
});
export default HomeWorkflow;
