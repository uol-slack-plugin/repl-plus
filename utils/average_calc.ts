
export const averageRating = (timeConsumption:number, ratingQuality:number, ratingDifficulty:number, ratingLearning:number): number =>{
  if(timeConsumption <= 0 || ratingQuality <= 0 || ratingDifficulty <= 0 || ratingLearning <= 0){
    throw new Error("Negative numbers not accepted in this function.")
  }
  return Number((ratingQuality+ratingLearning+convertIntToPoint(timeConsumption)+ convertIntToPoint(ratingDifficulty)) / 4);
}

export const convertIntToPoint = (num: number) => {
  if (typeof num !== 'number' || num < 1 || num > 5 || !Number.isInteger(num)) {
    throw new Error('Input must be an integer between 1 and 5');
  }

  switch (num) {
    case 1:
    case 5:
      return 1;
    case 2:
    case 4:
      return 3;
    case 3:
      return 5;
    default:
      throw new Error('Unexpected input');
  }
};
