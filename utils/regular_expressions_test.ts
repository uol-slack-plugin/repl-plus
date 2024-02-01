import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { assert,  } from "https://deno.land/std@0.67.0/_util/assert.ts";
import { separateString } from "./regular_expressions.ts";

Deno.test("Separate string with valid input", () => {
    const input = '{"key": "value"}\\string';
    const expected = {
        object: { key: "value" },
        stringPart: "string",
    };
    const result = separateString(input);
    assert(result);
    assert(result.object);
    assert(result.stringPart);
    assertEquals(result.object, expected.object);
    assertEquals(result.stringPart, expected.stringPart);
});

Deno.test("Separate string with invalid JSON", () => {
    const input = '{invalid}\\string';
    const result = separateString(input);
    assert(!result);
});

Deno.test("Separate string with invalid input format", () => {
    const input = 'invalid format';
    const result = separateString(input);
    assert(!result);
});

// Add more test cases as needed...
