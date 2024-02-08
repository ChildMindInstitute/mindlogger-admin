export const findClosestValues = (arr: number[], target: number) => {
  const closestBefore = arr.reduce((prev, curr) => (curr < target && curr > prev ? curr : prev), -Infinity);
  const closestAfter = arr.reduce((prev, curr) => (curr > target && curr < prev ? curr : prev), Infinity);

  return { closestBefore, closestAfter };
};
