import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { CREATE_REVIEW_FUNCTION_CALLBACK_ID} from "./create_review_function.ts";
import CreateReviewFunction from "./create_review_function.ts";

const { createContext } = SlackFunctionTester(CREATE_REVIEW_FUNCTION_CALLBACK_ID);

Deno.test("Output should be an empty object", async ()=>{
  const inputs = {
      user_id : "223123",
      module_name: "hello",
      review: "review"
  };

  const { outputs } = await CreateReviewFunction(createContext({ inputs }));
  
  assertEquals(outputs,{})
})
