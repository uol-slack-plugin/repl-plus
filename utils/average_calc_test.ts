import { assertEquals, assertThrows } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { averageRating } from "./average_calc.ts";
import { assert } from "https://deno.land/std@0.67.0/_util/assert.ts";


// TEST 1
Deno.test("should return a number for a valid rating inputs", ()=>{
  assertEquals(5, averageRating(5,5,5));
})

// TEST 2
Deno.test("should return a decimal number to 1dp for a valid rating inputs", ()=>{
  assertEquals(2.5, averageRating(2.5,2.5,2.5));
})

// TEST 3
Deno.test("should return a decimal number to 2dp for a valid rating inputs", ()=>{
  assert(2.33 <= averageRating(4,2,1) && averageRating(4,2,1) < 2.34);
})
// TEST 4
Deno.test("should throw an error for a invalid rating inputs", ()=>{
  assertThrows(()=>averageRating(-5,-5,-5));
})
