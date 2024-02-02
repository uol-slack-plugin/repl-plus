import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { Module } from "../types/module.ts";
import { Review } from "../types/classes/review.ts";
import { filterModulesWithoutReviews } from "./modules.ts";

const modules: Module[] = [
  {id:"module1111",name:"name",code:"code1"},
  {id:"module2222",name:"name",code:"code1"},
  {id:"module3333",name:"name",code:"code1"},
  {id:"1",name:"name",code:"code1"},
]

const reviews: Review[] = [
  {
    created_at: 1705945160264,
    id: "2222",
    module_id: "module2222",
    rating_difficulty: 4,
    rating_learning: 1,
    rating_quality: 2,
    content: "This is a sample review.",
    time_consumption: 4,
    updated_at: 2222,
    user_id: "U02FR10ETMY",
    title:"ttt",
    unhelpful_votes: 1,
    helpful_votes: 2
  },
  {
    created_at: 1705945160264,
    id: "3333",
    module_id: "module3333",
    rating_difficulty: 4,
    rating_learning: 1,
    rating_quality: 2,
    content: "This is a sample review.",
    time_consumption: 4,
    updated_at: 2222,
    user_id: "U02FR10ETMY",
    title:"ttt",
    unhelpful_votes: 1,
    helpful_votes: 2
  },
  {
    created_at: 1705945160264,
    id: "1",
    module_id: "1",
    rating_difficulty: 4,
    rating_learning: 1,
    rating_quality: 2,
    content: "This is a sample review.",
    time_consumption: 4,
    updated_at: 2222,
    user_id: "U02FR10ETMY",
    title:"ttt",
    unhelpful_votes: 1,
    helpful_votes: 2
  },
  
  
  
]

Deno.test("should return an array with the modules not reviewed by user", ()=>{

  assertEquals(filterModulesWithoutReviews(modules,reviews),[{ id: "module1111", name: "name", code: "code1" }] )

})

Deno.test("should return an array with the modules not reviewed by user but added one if the id exist in modules", ()=>{

  assertEquals(filterModulesWithoutReviews(modules,reviews,"1"),[{ id: "module1111", name: "name", code: "code1" },{ id: "1", name: "name", code: "code1" }] )

})