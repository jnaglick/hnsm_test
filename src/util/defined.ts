// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defined<T>(thing: T | null | undefined): thing is T {
  return thing !== null && thing !== undefined;
}
