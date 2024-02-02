import { Module } from "../types/module.ts";
import { Review } from "../types/classes/review.ts";

export function findModuleById(modules: Module[], id: string| undefined): Module | undefined {
  for (const module of modules) {
    if (module.id === id) {
      return module;
    }
  }
  return undefined;
}

export function findModuleNameById(modules: Module[], id: string): string  {
  for (const module of modules) {
    if (module.id === id) {
      return module.name;
    }
  }
  return "No found";
}

export function filterModulesWithoutReviews(modules: Module[], reviews: Review[], excludedReviewId?: string): Module[] {
  const reviewedModuleIds = new Set(reviews.map(review => review.module_id));

  // Exclude the review ID if provided
  if (excludedReviewId) {
    const index = reviews.findIndex(review => review.id === excludedReviewId);
    if (index !== -1) {
      reviewedModuleIds.delete(reviews[index].module_id);
    }
  }

  return modules.filter(module => !reviewedModuleIds.has(module.id));
}