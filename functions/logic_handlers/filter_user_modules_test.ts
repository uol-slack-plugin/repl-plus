// import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
// import { FILTER_USER_MODULES_FUNCTION_CALLBACK_ID } from "./filter_user_modules.ts";
// import FilterUserModules from "./filter_user_modules.ts";

// import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";

// const { createContext } = SlackFunctionTester(
//   FILTER_USER_MODULES_FUNCTION_CALLBACK_ID,
// );

// // TEST 1
// Deno.test("TEST 1: Should return an array of the modules that the user has not reviewed yet", async () => {
//   const inputs = {
//     user_reviews: [
//       {
//         id: "6e94a6b2-1a42-4b60-92d5-477556a27f0c",
//         user_id: "U02FR10ETMY",
//         module_id: "aaaa",
//         review: "This is the review",
//         time_consumption: 1,
//         rating_quality: 1,
//         rating_difficulty: 1,
//         rating_learning: 3,
//         created_at: 1705768638058,
//         updated_at: 1705945216417,
//       },
//       {
//         id: "89d7c1ab-e1e7-455f-8431-7df600b39163",
//         user_id: "U02FR10ETMY",
//         module_id: "bbbb",
//         review: "hello world",
//         time_consumption: 3,
//         rating_quality: 2,
//         rating_difficulty: 2,
//         rating_learning: 1,
//         created_at: 1705966395629,
//         updated_at: 1705966395629,
//       },
//     ],
//     modules: [
//       {
//         "id": "aaaa",
//         "code": "CM2020",
//         "name": "Fundamentals of computer",
//         "rating": 1.5,
//       },
//       {
//         "id": "bbbb",
//         "code": "CM2030",
//         "name": "Computer Math",
//         "rating": 1.5,
//       },
//       {
//         "id": "cccc",
//         "code": "CM2040",
//         "name": "Databases And Network Systems",
//         "rating": 1.5,
//       },
//     ],
//   };

//   const { outputs } = await FilterUserModules(createContext({ inputs }));

//   assertEquals(outputs?.modules_not_reviewed, [
//     "Databases And Network Systems",
//   ]);
// });

// // TEST 2
// Deno.test("TEST 2: Should return an empty array if all the modules has been reviewed", async () => {
//   const inputs = {
//     user_reviews: [
//       {
//         id: "6e94a6b2-1a42-4b60-92d5-477556a27f0c",
//         user_id: "U02FR10ETMY",
//         module_id: "aaaa",
//         review: "This is the review",
//         time_consumption: 1,
//         rating_quality: 1,
//         rating_difficulty: 1,
//         rating_learning: 3,
//         created_at: 1705768638058,
//         updated_at: 1705945216417,
//       },
//       {
//         id: "89d7c1ab-e1e7-455f-8431-7df600b39163",
//         user_id: "U02FR10ETMY",
//         module_id: "bbbb",
//         review: "hello world",
//         time_consumption: 3,
//         rating_quality: 2,
//         rating_difficulty: 2,
//         rating_learning: 1,
//         created_at: 1705966395629,
//         updated_at: 1705966395629,
//       },
//       {
//         id: "89d7c1ab-e1e7-455f-8431-7df600b39163",
//         user_id: "U02FR10ETMY",
//         module_id: "cccc",
//         review: "hello world",
//         time_consumption: 3,
//         rating_quality: 2,
//         rating_difficulty: 2,
//         rating_learning: 1,
//         created_at: 1705966395629,
//         updated_at: 1705966395629,
//       },
//     ],
//     modules: [
//       {
//         "id": "aaaa",
//         "code": "CM2020",
//         "name": "Fundamentals of computer",
//         "rating": 1.5,
//       },
//       {
//         "id": "bbbb",
//         "code": "CM2030",
//         "name": "Computer Math",
//         "rating": 1.5,
//       },
//       {
//         "id": "cccc",
//         "code": "CM2040",
//         "name": "Databases And Network Systems",
//         "rating": 1.5,
//       },
//     ],
//   };

//   const { outputs } = await FilterUserModules(createContext({ inputs }));

//   assertEquals(outputs?.modules_not_reviewed, []);
// });

// // TEST 3
// Deno.test("TEST 3: Should the size of the modules array be equal to the output array if the user has not submit a review", async () => {
//   const inputs = {
//     user_reviews: [],
//     modules: [
//       {
//         "id": "aaaa",
//         "code": "CM2020",
//         "name": "Fundamentals of computer",
//         "rating": 1.5,
//       },
//       {
//         "id": "bbbb",
//         "code": "CM2030",
//         "name": "Computer Math",
//         "rating": 1.5,
//       },
//       {
//         "id": "cccc",
//         "code": "CM2040",
//         "name": "Databases And Network Systems",
//         "rating": 1.5,
//       },
//     ],
//   };

//   const { outputs } = await FilterUserModules(createContext({ inputs }));

//   assertEquals(outputs?.modules_not_reviewed.length, 3);
// });
