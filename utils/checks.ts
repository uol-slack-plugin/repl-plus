export function isNullElement(element: (string|null)[]): boolean {
  return element.length === 1 && element[0] === null;
}