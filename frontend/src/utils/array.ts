export type NonEmptyArray<T> = [elem: T, ...rest: T[]];

export function isNonEmptyArray<Type>(
  arr: Type[]
): arr is NonEmptyArray<Type> {
  return arr.length > 0;
}
