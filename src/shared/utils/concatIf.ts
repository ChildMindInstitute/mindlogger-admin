export const concatIf = (source: string | undefined, value: string, condition?: boolean): string | undefined => {
  if (typeof condition === 'undefined') return source ? source.concat(value) : source;

  return condition && source ? source.concat(value) : source;
};
