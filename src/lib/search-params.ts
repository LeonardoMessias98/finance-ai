export function isTruthySearchParam(value: string | string[] | undefined): boolean {
  return value === "1" || value === "true" || value === "open";
}
