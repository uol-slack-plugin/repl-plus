export const averageRating = (a:number, b:number, c:number): number =>{
  if(a <= 0 || b <= 0 || c <= 0){
    throw new Error("Negative numbers not accepted in this function.")
  }

  return Number((a+b+c) / 3)
}