export function separateString(input: string): { object: object, stringPart: string } | null {
  const regex = /^(?<objectStr>{.+})\\(?<stringPart>.+)$/;
  const match = input.match(regex);

  if (!match || !match.groups) {
      return null;
  }

  const { objectStr, stringPart } = match.groups;
  let object: object;
  try {
      object = JSON.parse(objectStr);
  } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
  }

  return { object, stringPart };
}


