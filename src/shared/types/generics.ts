export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type MaybeNull<T> = T | null;

/**
 * A utility type that requires at least one of the keys in the object to be present. Useful for defining
 * a type with all optional keys, where its use requires at least one of the keys to be present.
 */
export type AtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Constructs a tuple of one or more distinct elements from T (a string, number, or symbol union)
 *
 * Usage:
 * ```ts
 * type MyTuple = UniqueTuple<'foo' | 'bar'>;
 *
 * // Accepted
 * const validTuple: MyTuple = ['foo', 'bar'];
 * const validTuple2: MyTuple = ['foo'];
 * const validTuple3: MyTuple = ['bar'];
 *
 * // Not accepted
 * const invalidTuple: MyTuple = ['foo', 'foo']; // Error: Duplicate element 'foo'
 * const invalidTuple2: MyTuple = ['foo', 'bar', 'baz']; // Error: 'baz' is not part of the union
 * const invalidTuple3: MyTuple = []; // Error: Empty tuple
 * ```
 */
export type UniqueTuple<
  T extends string | number | symbol,
  U extends string | number | symbol = T,
> = [U] extends [never] ? never : { [K in U]: [K] | [K, ...UniqueTuple<T, Exclude<U, K>>] }[U];
